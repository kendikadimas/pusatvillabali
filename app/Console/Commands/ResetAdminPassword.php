<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class ResetAdminPassword extends Command
{
    protected $signature = 'app:reset-admin-password {--email=admin@pusatvillabali.com : Admin email address} {--password=admin123 : New password}';

    protected $description = 'Reset admin user password';

    public function handle(): int
    {
        $email = $this->option('email');
        $password = $this->option('password');

        $user = User::where('email', $email)->first();

        if (! $user) {
            $this->error("User with email '{$email}' not found.");

            return self::FAILURE;
        }

        $user->update([
            'password' => Hash::make($password),
        ]);

        $this->info("Password for '{$email}' has been reset successfully.");

        return self::SUCCESS;
    }
}
