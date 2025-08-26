<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        'api/*',
        '/api/*',
        'http://localhost:3000/*',
        'http://localhost:3001/*',
        'http://127.0.0.1:3000/*',
        'http://127.0.0.1:3001/*',
    ];
}
