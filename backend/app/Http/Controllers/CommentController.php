<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommentRequest;
use App\Http\Requests\UpdateCommentRequest;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\CommentResource;
use App\Services\CommentService;
use App\Services\PostService;

class CommentController extends Controller
{
    protected $commentService;
    protected $postService;

    public function __construct(CommentService $commentService, PostService $postService)
    {
        $this->commentService = $commentService;
        $this->postService = $postService;
    }
    /**
     * Store a newly created comment in storage.
     */
    public function store(StoreCommentRequest $request, $postId)
    {
        $post = $this->postService->getPostById($postId);

        $comment = $this->commentService->createComment([
            'user_id' => Auth::guard('api')->id(),
            'post_id' => $post->id,
            'body' => $request->body,
        ]);

        return (new CommentResource($comment->load('author')))->response()->setStatusCode(201);
    }

    /**
     * Update the specified comment in storage.
     */
    public function update(UpdateCommentRequest $request, $id)
    {
        $comment = $this->commentService->getCommentById($id);

        $this->authorize('update', $comment);
    
        $updatedComment = $this->commentService->updateComment($id, ['body' => $request->body]);

        return new CommentResource($updatedComment->load('author'));
    }

    /**
     * Remove the specified comment from storage.
     */
    public function destroy($id)
    {
        $comment = $this->commentService->getCommentById($id);

        if ($comment->user_id !== Auth::guard('api')->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $this->commentService->deleteComment($id);

        return response()->json(['message' => 'Comment deleted successfully']);
    }
}
