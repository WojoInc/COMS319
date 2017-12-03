<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Shelf extends Model
{
    //
    protected $fillable = [
        'shelf_name'
    ];

    protected $table = 'shelves';

    public function books()
    {
        return $this->hasMany('App\Book');
    }
}
