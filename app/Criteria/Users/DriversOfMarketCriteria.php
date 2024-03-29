<?php
namespace App\Criteria\Users;

use Prettus\Repository\Contracts\CriteriaInterface;
use Prettus\Repository\Contracts\RepositoryInterface;

/**
 * Class DriversOfMarketCriteria.
 *
 * @package namespace App\Criteria\Users;
 */
class DriversOfMarketCriteria implements CriteriaInterface
{
    /**
     * @var int
     */
    private $marketId;

    /**
     * DriversOfMarketCriteria constructor.
     */
    public function __construct(int $marketId)
    {
        $this->marketId = $marketId;
    }

    /**
     * Apply criteria in query repository
     *
     * @param string              $model
     * @param RepositoryInterface $repository
     *
     * @return mixed
     */
    public function apply($model, RepositoryInterface $repository)
    {
        return $model->join('driver_markets','users.id','=','driver_markets.user_id')
            ->where('driver_markets.market_id',$this->marketId);
    }
}
