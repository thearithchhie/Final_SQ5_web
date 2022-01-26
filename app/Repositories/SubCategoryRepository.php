<?php

namespace App\Repositories;
use InfyOm\Generator\Common\BaseRepository;
use App\Models\SubCategory;

class SubCategoryRepository extends BaseRepository {
  
      /**
     * @var array
     */
    protected $fieldSearchable = [
        'name',
        'description',
        'category_id'
    ];
    
    /**
    * Configure the Model
    **/

    public function model()
    {
      return SubCategory::class;
    }

}

?>