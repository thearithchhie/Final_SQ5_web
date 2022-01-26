<?php

namespace App\Http\Controllers\FrontEnd\API;

use Flash;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Prettus\Validator\Exceptions\ValidatorException;

class ProductAPIController extends Controller
{
    /**
     * @request code
     * @request int markerId
     */
    public function applyCouponProduct(Request $request)
    {

        $is_valid_coupon = false;
        $code = $request->code;
        $market_id = $request->marketId;

        $coupon = Coupon::where('code', $code)
            ->where('expires_at', '>=', Carbon::now()->format('Y-m-d'))
            ->where('enabled', '1')
            ->with('discountables')
            ->first();

        try {
            if ($coupon) {
                $couponValue = [
                    'code' => $coupon->code,
                    'discount' => $coupon->discount,
                    'discount_type' => $coupon->discount_type,
                    'expires_at' => $coupon->expires_at,
                    'discountables' => $coupon->discountables
                ];
    
                foreach ($coupon->discountables as $dist) {
                    if ($dist->discountable_type == "App\\Models\\Market" && $dist->discountable_id == $market_id) {
                        $is_valid_coupon = true;
                    }
                }
                $coupon_checked = DB::table('coupons')->where('code', $code)->count();
                if ($coupon_checked && $is_valid_coupon) {
                    return response()->json(['success' => 'Coupon apply successfully', 'coupon' => $couponValue]);
                }else {
                    return response()->json(['error' => 'Coupon cannot apply this product']);
                }
            } else {
                return response()->json(['error' => 'Coupon apply invalid']);
            }

//                $userId = auth()->user()->id;
//                $checkUser = DB::table('users_coupons')
//                ->where('user_id', $userId)
//                    ->where('coupon_id', $coupon->id)
//                    ->count();
//                if (!$checkUser && $is_valid_coupon) {
//                    DB::table('users_coupons')->insert([
//                        'user_id' => $userId,
//                        'coupon_id' => $coupon->id
//                    ]);
//                    return response()->json(['success' => 'Coupon apply successfully','coupon' => $couponValue ]);
//
//                } else if ($checkUser) {
//                    return response()->json(['error' => 'Coupon apply already']);
//                } else {
//                    return response()->json(['error' => 'Coupon cant`t apply this product']);
//                }
//            } else {
//                return response()->json(['error' => 'Coupon apply invalid']);
                // return response()->json(['success' => 'Coupon apply successfully', 'coupon' => $couponValue]);
            // }else {
            //     return response()->json(['error' => 'Coupon apply invalid']);
            // }
        } catch (ValidatorException $e) {
            Flash::error($e->getMessage());
        }
    }

    public function __init()
    {
        // TODO: Implement __init() method.
    }
}
