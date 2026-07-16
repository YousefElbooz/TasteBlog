<?php

namespace App\Repositories\Contracts;

interface PostRepositoryInterface extends BaseRepositoryInterface
{
    public function getAllWithRelations(array $relations);
    public function findWithRelations($id, array $relations);
    public function findWithRelationsOrFail($id, array $relations);
}
