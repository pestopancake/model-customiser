<?php

namespace App\Models;

use Faker\Generator;
use Illuminate\Database\Schema\Blueprint;
use Redbastie\Tailwire\Model;

class Quote extends Model
{

    public $casts = [
        'data' => 'array'
    ];

    public function migration(Blueprint $table)
    {
        $table->id();
        $table->string('name');
        $table->string('email');
        $table->json('data');

        $table->timestamp('created_at')->nullable();
        $table->timestamp('updated_at')->nullable();
    }

    public function definition(Generator $faker)
    {
        return [
            'name' => $faker->name,
            'email' => $faker->email,
            'data' => $faker->data,
        ];
    }
}
