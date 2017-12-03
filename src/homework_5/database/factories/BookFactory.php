<?php
/**
 * Created by PhpStorm.
 * User: wojoinc
 * Date: 12/1/17
 * Time: 12:44 PM
 */

use Faker\Generator as Faker;
use App\Book;

$factory->define(Book::class, function (Faker $faker) {
    return [
        'book_name' => $faker->sentence,
        'author' => $faker->name,
        'shelf_id' => $faker->numberBetween(1, 4),
        'availability' => '1'
    ];
});