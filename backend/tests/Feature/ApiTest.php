<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Post;

class ApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_signup()
    {
        $response = $this->postJson('/api/signup', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['access_token']);
    }

    public function test_user_can_login()
    {
        $user = User::factory()->create([
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['access_token']);
    }

    public function test_invalid_login()
    {
        $response = $this->postJson('/api/login', [
            'email' => 'wrong@example.com',
            'password' => 'wrongpass',
        ]);

        $response->assertStatus(401);
    }

    public function test_create_post_requires_auth()
    {
        $response = $this->postJson('/api/posts', [
            'title' => 'Test Post',
            'body' => 'Test Body',
            'tags' => ['Tech'],
        ]);

        $response->assertStatus(401);
    }

    public function test_user_can_create_post()
    {
        $user = User::factory()->create();
        $token = auth('api')->login($user);

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->postJson('/api/posts', [
                             'title' => 'Test Post',
                             'body' => 'Test Body',
                             'tags' => ['Tech'],
                         ]);

        $response->assertStatus(201)
                 ->assertJsonFragment(['title' => 'Test Post']);
    }

    public function test_user_cannot_delete_others_post()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $post = Post::create([
            'user_id' => $user1->id,
            'title' => 'User1 Post',
            'body' => 'Content',
        ]);

        $token2 = auth('api')->login($user2);

        $response = $this->withHeaders(['Authorization' => "Bearer $token2"])
                         ->deleteJson("/api/posts/{$post->id}");

        $response->assertStatus(403);
    }
}
