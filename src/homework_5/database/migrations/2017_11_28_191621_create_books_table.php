<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBooksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('books_table', function (Blueprint $table) {
            $table->increments('id');
            $table->string('book_name');
            $table->string('author');
            $table->integer('availability')->default(true);
            $table->integer('shelf_id');

            $table->timestamps();

            $table->foreign('shelf_id')->references('id')->on('shelf');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('books_table');
    }
}
