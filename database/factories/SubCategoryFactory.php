<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\SubCategory;
use Faker\Generator as Faker;

$factory->define(SubCategory::class, function (Faker $faker) {
    return [
        'name' => $faker->randomElement(['Vegetables1', 'Vegetables2', 'Vegetables3', 'Vegetables4', 'Vegetables5', 'Vegetables6', 'Vegetables7']),
        'description' => $faker->sentences(5, true),
        'category_id' => '1',
    ];
});
