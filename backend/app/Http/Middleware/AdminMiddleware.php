<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (\Illuminate\Support\Facades\Auth::guard('api')->check() && \Illuminate\Support\Facades\Auth::guard('api')->user()->isAdmin()) {
            return $next($request);
        }

        return response()->json(['error' => 'Forbidden - Admin access required'], 403);
    }
}
