<?php

namespace App\Http\Controllers\FrontEnd;
use App\Http\Controllers\Controller;
use App\Models\{Product};
class CategoryController extends Controller
{
     /* 
     * show product by category name
     * param category_id
     */
     public function categoryProductDetail($id){           
      	$data['product_all'] = Product::where('category_id',$id)
                                   ->with('media')
                                   ->paginate(3);                  
          return view('frontend.product.desktop.index', $data);
     }

}