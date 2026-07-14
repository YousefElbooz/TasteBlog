<?php

namespace App\Console\Commands;

use App\Models\Post;
use Carbon\Carbon;
use Illuminate\Console\Command;

class DeleteExpiredPostsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:delete-expired-posts';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete posts that are older than 24 hours';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $expiredPosts = Post::where('created_at', '<', Carbon::now()->subHours(24))->get();
        $count = $expiredPosts->count();
        
        foreach ($expiredPosts as $post) {
            // Using soft delete as requested
            $post->delete();
        }

        $this->info("Successfully deleted {$count} expired posts.");
    }
}
