<?php

use App\User;
use Faker\Factory;
use Illuminate\Database\Seeder;
use App\Shelf;
use App\Book;
use Faker\Generator as Faker;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // $this->call(UsersTableSeeder::class);
        $shelf = new Shelf;
        $shelf->shelf_name = 'Art';
        $shelf->save();
        $shelf = new Shelf;
        $shelf->shelf_name = 'Science';
        $shelf->save();
        $shelf = new Shelf;
        $shelf->shelf_name = 'Sport';
        $shelf->save();
        $shelf = new Shelf;
        $shelf->shelf_name = 'Literature';
        $shelf->save();

        \factory(User::class, 30)->create();
        \factory(Book::class, 30)->create();
        $faker = Factory::create('en_US');
        $loan = new \App\Loan;

        $loan->user_id = 1;
        $loan->book_id = 5;
        $loan->due_date = $faker->dateTime();
        $loan->returned_date = $faker->dateTime();
        $loan->save();
    }
}
