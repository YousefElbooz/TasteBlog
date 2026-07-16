<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\Posts\StorePostRequest;
use App\Http\Requests\Posts\UpdatePostRequest;
use App\Http\Resources\PostResource;
use App\Services\PostService;

class PostController extends Controller
{
    protected $postService;

    public function __construct(PostService $postService)
    {
        $this->postService = $postService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return PostResource::collection($this->postService->getAllPosts());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePostRequest $request)
    {
        $data = [
            'user_id' => Auth::guard('api')->id(),
            'title' => $request->title,
            'body' => $request->body,
        ];
        
        $post = $this->postService->createPost($data, $request->tags ?? []);

        return (new PostResource($post))->response()->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $post = $this->postService->getPostById($id);
        return new PostResource($post);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostRequest $request, $id)
    {
        $post = $this->postService->getPostById($id);
        
        $this->authorize('update', $post);

        $updatedPost = $this->postService->updatePost($id, $request->only(['title', 'body']), $request->tags);

        return new PostResource($updatedPost);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $post = $this->postService->getPostById($id);
        $this->authorize('delete', $post);

        $this->postService->deletePost($id);

        return response()->json(['message' => 'Post deleted successfully']);
    }
}
