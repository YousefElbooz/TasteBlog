<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );

        $exceptions->render(function(
            \Symfony\Component\HttpKernel\Exception\NotFoundHttpException $e,
            Request $request
        ){

            if($request->is('api/*')) {
                    error_log("API Error Caught: " . $e->getMessage());

                return response()->json([
                    'success' => false,
                    'message' => 'Resource not found.',
                    'errors'  => null
                ], 404);
            }
        });

        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException $e, Request $request) {
        if ($request->is('api/*')) {
            error_log("API Error Caught: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'You do not have permission to perform this action.',
                'errors'  => null
            ], 403);
        }
         });

         $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                error_log("API Error Caught: " . $e->getMessage());
    
                return response()->json([
                    'success' => false,
                    'message' => 'The HTTP method used is not supported for this route.',
                    'errors'  => null
                ], 405);
            }
        });


         $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, Request $request) {
            if ($request->is('api/*')) {
                error_log("API Error Caught: " . $e->getMessage());

                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated. Please log in.',
                    'errors'  => null
                ], 401);
            }
        });

        $exceptions->render(function (\Throwable $e, Request $request) {
            if ($request->is('api/*')) {
                // Ignore expected HTTP exceptions so they can be handled by other renderers or natively
                if ($e instanceof \Symfony\Component\HttpKernel\Exception\HttpExceptionInterface || $e instanceof \Illuminate\Validation\ValidationException || $e instanceof \Illuminate\Auth\AuthenticationException) {
                    return null;
                }

                \Illuminate\Support\Facades\Log::error("Unhandled API Error: " . $e->getMessage(), ['trace' => $e->getTraceAsString()]);

                return response()->json([
                    'success' => false,
                    'message' => 'An unexpected server error occurred.',
                    'error'  => config('app.debug') ? $e->getMessage() : null
                ], 500);
            }
        });

    })->create();
