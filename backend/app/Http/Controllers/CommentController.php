<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommentRequest;
use App\Http\Requests\UpdateCommentRequest;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CommentController extends Controller
{
    /**
     * Store a newly created comment in storage.
     */
    public function store(StoreCommentRequest $request, $postId)
    {
        $post = Post::find($postId);
        if (!$post) {
            return response()->json(['error' => 'Post not found'], 404);
        }

        $comment = Comment::create([
            'user_id' => Auth::guard('api')->id(),
            'post_id' => $post->id,
            'body' => $request->body,
        ]);

        return response()->json($comment->load('author'), 201);
    }

    /**
     * Update the specified comment in storage.
     */
    public function update(UpdateCommentRequest $request, $id)
    {
        $comment = Comment::find($id);
        if (!$comment) {
            return response()->json(['error' => 'Comment not found'], 404);
        }

        $this->authorize('update', $comment);

    
        $comment->update(['body' => $request->body]);

        return response()->json($comment->load('author'));
    }

    /**
     * Remove the specified comment from storage.
     */
    public function destroy($id)
    {
        $comment = Comment::find($id);
        if (!$comment) {
            return response()->json(['error' => 'Comment not found'], 404);
        }

        if ($comment->user_id !== Auth::guard('api')->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully']);
    }
}
