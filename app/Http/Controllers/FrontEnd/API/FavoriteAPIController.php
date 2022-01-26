<?php

namespace App\Http\Controllers\FrontEnd\API;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\Favorite;
class FavoriteAPIController extends Controller
{
    /**
     * Create data to Favorite
     * @param Request $request
     * @param  $product_id
     * @param  $user_id
     * @return JsonResponse
     */
    public function addToWishList($product_id)
    {
        if (Auth::check()) {
            $exist = Favorite::where('user_id', Auth::id())
                ->where('product_id', $product_id)->first();
            if (!$exist) {
                Favorite::insert([
                    'user_id'    => Auth::id(),
                    'product_id' => $product_id,
                    'created_at' => Carbon::now(),
                ]);
            } else {
                return response()->json(['error' => 'Product already in wishlist']);
            }
            return response()->json(['success' => 'Product add to wishlist successfully ']);
        } else {
            return response()->json(['error' => 'please login first']);
        }
    }
}
