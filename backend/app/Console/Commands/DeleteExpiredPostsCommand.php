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
        // Find posts older than 1 minute
        $expiredPosts = Post::where('created_at', '<', now()->subMinutes(1))->get();
        $count = $expiredPosts->count();
        
        foreach ($expiredPosts as $post) {
            // Send it to the Database Queue!
            \App\Jobs\DeletePostJob::dispatch($post);
        }

        $this->info("Successfully dispatched {$count} expired posts to the queue.");
    }

}
