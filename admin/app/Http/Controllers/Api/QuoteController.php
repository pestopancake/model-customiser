<?php

namespace App\Http\Controllers\Api;

use App\Models\Quote;
use Illuminate\Http\Request;

class QuoteController extends ApiBaseController
{

    public function get(Quote $quote)
    {
        return $this->respondWith($quote);
    }

    public function create(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required'],
            'email' => ['required'],
        ]);

        $result = Quote::create($request->all());

        if (!$result) {
            $this->addError('failed to create quote');
        }

        return $this->respondWith($result);
    }
}
