<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    //
    protected $fillable = [
        'book_name', 'author', 'shelf_id', 'availability'
    ];
    protected $table = 'books_table';

    public function loans()
    {
        return $this->hasMany('App\Loan');
    }
}
