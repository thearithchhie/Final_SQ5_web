<?php

namespace App\Criteria\Products;

use Illuminate\Http\Request;
use Prettus\Repository\Contracts\CriteriaInterface;
use Prettus\Repository\Contracts\RepositoryInterface;

/**
 * Class ProductsOfFieldsCriteria.
 *
 * @package namespace App\Criteria\Products;
 */
class ProductsOfFieldsCriteria implements CriteriaInterface
{
    /**
     * @var array
     */
    private $request;

    /**
     * ProductsOfFieldsCriteria constructor.
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * Apply criteria in query repository
     *
     * @param string $model
     * @param RepositoryInterface $repository
     *
     * @return mixed
     */
    public function apply($model, RepositoryInterface $repository)
    {
    
        if (!$this->request->has('fields')) {
            $name = $this->request->get('name');
            if ($name) {
                return $model->where('products.name','LIKE','%'.$name.'%')->with('media');
                // return $model->where('products.name','LIKE','%'.$name.'%')->with('media');
                // return $model->where('products.name','LIKE','%'.$name.'%')->with('media')->select('categories.*')->get();
            } else {
                return $model;
            }
          
        } else {

            $fields = $this->request->get('fields');

            if (in_array('0', $fields)) { // means all fields
                return $model;
            }
            return $model->join('market_fields', 'market_fields.market_id', '=', 'products.market_id')
                ->whereIn('market_fields.field_id', $this->request->get('fields',[]))->groupBy('products.id');
        }
    }
}