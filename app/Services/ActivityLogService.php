<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class ActivityLogService
{
    public static function log(
        string $action,
        string $module,
        string $subject = '',
        string $description = ''
    ): void {
        $user = Auth::guard('sanctum')->user() ?? Auth::user();

        ActivityLog::create([
            'user_id'    => $user?->id,
            'actor_name' => $user?->name ?? 'System',
            'action'     => $action,
            'module'     => $module,
            'subject'    => $subject,
            'description' => $description,
        ]);
    }
}
