<?php

namespace App\Repositories\Eloquent;

use App\Models\Post;
use App\Repositories\Contracts\PostRepositoryInterface;

class PostRepository extends BaseRepository implements PostRepositoryInterface
{
    public function __construct(Post $model)
    {
        parent::__construct($model);
    }

    public function getAllWithRelations(array $relations)
    {
        return $this->model->with($relations)->latest()->get();
    }

    public function findWithRelations($id, array $relations)
    {
        return $this->model->with($relations)->find($id);
    }

    public function findWithRelationsOrFail($id, array $relations)
    {
        return $this->model->with($relations)->findOrFail($id);
    }
}
