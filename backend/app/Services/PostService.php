<?php

namespace App\Services;

use App\Repositories\Contracts\PostRepositoryInterface;
use App\Repositories\Contracts\TagRepositoryInterface;

class PostService
{
    protected $postRepository;
    protected $tagRepository;

    public function __construct(PostRepositoryInterface $postRepository, TagRepositoryInterface $tagRepository)
    {
        $this->postRepository = $postRepository;
        $this->tagRepository = $tagRepository;
    }

    public function getAllPosts()
    {
        return $this->postRepository->getAllWithRelations(['author', 'tags', 'comments.author']);
    }

    public function getPostById($id)
    {
        return $this->postRepository->findWithRelationsOrFail($id, ['author', 'tags', 'comments.author']);
    }

    public function createPost(array $data, array $tags)
    {
        $post = $this->postRepository->create($data);
        $this->syncTags($post, $tags);
        return $post->load(['author', 'tags']);
    }

    public function updatePost($id, array $data, ?array $tags)
    {
        $post = $this->postRepository->update($id, $data);
        if ($post && $tags !== null) {
            $this->syncTags($post, $tags);
        }
        return $post ? $post->load(['author', 'tags']) : null;
    }

    public function deletePost($id)
    {
        return $this->postRepository->delete($id);
    }

    protected function syncTags($post, array $tags)
    {
        $tagIds = [];
        foreach ($tags as $tagName) {
            $tag = $this->tagRepository->firstOrCreate(['name' => $tagName]);
            $tagIds[] = $tag->id;
        }
        $post->tags()->sync($tagIds);
    }
}
