<?php


namespace App\Repositories;

use App\Models\{Product,ProductReview};
use InfyOm\Generator\Common\BaseRepository;
use Prettus\Repository\Contracts\CacheableInterface;
use Prettus\Repository\Traits\CacheableRepository;

/**
 * Class ProductRepository
 * @package App\Repositories
 * @version August 29, 2019, 9:38 pm UTC
 *
 * @method Product findWithoutFail($id, $columns = ['*'])
 * @method Product find($id, $columns = ['*'])
 * @method Product first($columns = ['*'])
 */
class ProductRepository extends BaseRepository implements CacheableInterface
{

    use CacheableRepository;
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'name',
        'price',
        'discount_price',
        'description',
        'capacity',
        'package_items_count',
        'deliverable',
        'unit',
        'featured',
        'market_id',
        'category_id'
    ];

    /**
     * Configure the Model
     **/
    public function model()
    {
        return Product::class;
    }

    /**
     * get my products
     **/
    public function myProducts()
    {
        return Product::join("user_markets", "user_markets.market_id", "=", "products.market_id")
            ->where('user_markets.user_id', auth()->id())->get();
    }

    public function groupedByMarkets()
    {
        $products = [];
        foreach ($this->all() as $model) {
            if(!empty($model->market)){
            $products[$model->market->name][$model->id] = $model->name;
        }
        }
        return $products;
    }

//    public function productSlide() {
//        return Product::where('status', 1)
//		->with(['media','market'])
//		->orderBy('id','DESC')
//		->take(5)
//		->get();
//    }
}