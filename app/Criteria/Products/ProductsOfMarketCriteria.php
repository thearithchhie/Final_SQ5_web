<?php
namespace App\Criteria\Products;


use Prettus\Repository\Contracts\CriteriaInterface;
use Prettus\Repository\Contracts\RepositoryInterface;

/**
 * Class ProductsOfMarketCriteria.
 *
 * @package namespace App\Criteria\Products;
 */
class ProductsOfMarketCriteria implements CriteriaInterface
{
    /**
     * @var int
     */
    private $marketId;

    /**
     * ProductsOfMarketCriteria constructor.
     */
    public function __construct($marketId)
    {
        $this->marketId = $marketId;
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
        return $model->where('market_id', '=', $this->marketId);
    }
}
