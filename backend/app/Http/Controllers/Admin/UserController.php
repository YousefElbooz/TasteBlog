<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\UserService;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function index()
    {
        return UserResource::collection($this->userService->getAllUsers());
    }

    public function show($id)
    {
        $user = $this->userService->getUserById($id);
        return new UserResource($user);
    }

    public function update(Request $request, $id)
    {
        $user = $this->userService->getUserById($id);

        $data = $request->only(['name', 'email', 'role']);
        if ($request->has('password') && !empty($request->password)) {
            $data['password'] = \Illuminate\Support\Facades\Hash::make($request->password);
        }

        $updatedUser = $this->userService->updateUser($id, $data);
        return new UserResource($updatedUser);
    }

    public function destroy($id)
    {
        $this->userService->deleteUser($id);
        return response()->json(['message' => 'User deleted successfully']);
    }
}
