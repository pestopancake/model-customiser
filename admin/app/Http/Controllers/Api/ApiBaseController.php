<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

class ApiBaseController extends Controller
{
    private array $errors = [];

    protected function setErrors(array $errors)
    {
        $this->errors = $errors;
    }

    protected function addError(string $error)
    {
        $this->errors[] = $error;
    }

    public function respondWith($data)
    {
        $response = [
            'data' => $data
        ];

        if ($this->errors) {
            $response['errors'] = $this->errors;
        }

        return $response;
    }
}
