<?php

namespace App\Repositories\Contracts;

interface TagRepositoryInterface extends BaseRepositoryInterface
{
    public function firstOrCreate(array $attributes);
}
