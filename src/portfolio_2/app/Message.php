<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    //
    protected $fillable = ['user_id', 'message'];
    protected $table = 'messages';

    public function user() {
        return $this->belongsTo(User::class);
    }
}
