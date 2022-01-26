<?php

namespace App\Http\Controllers\FrontEnd;

use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Models\{Favorite};
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    
    /**
     * Display all data in Favorite
     */
    public function index()
    {
        if (Auth::check()) {
            $data['favorites'] = Favorite::where('user_id', Auth::id())->with('product')->paginate(3);
        } else {
            return redirect(url('/account/login'));
        }
        return view('frontend.wish_list.index', $data);
    }

    /**
     * Delete data to Favorite by id
     * method POST
     * @param  $user_id
     * @return JsonResponse
     */
    public function destroy($id){
        Favorite::where('user_id',Auth::id())->where('id',$id)->delete();
        return redirect()->back();
    }
}