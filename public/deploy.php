<?php

$secret = 'pusatvillabali-deploy-secret-2024';
$repo_path = '/home/pusatvil/pusatvillabali';
$log_file = $repo_path . '/storage/logs/deploy.log';

function log_message($message) {
    global $log_file;
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($log_file, "[$timestamp] $message\n", FILE_APPEND);
}

// Verify webhook signature
$signature = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';
$payload = file_get_contents('php://input');
$expected = 'sha256=' . hash_hmac('sha256', $payload, $secret);

if (!hash_equals($expected, $signature)) {
    http_response_code(403);
    log_message('Invalid signature');
    exit('Invalid signature');
}

$data = json_decode($payload, true);
$branch = $data['ref'] ?? '';

// Only deploy on production branch
if ($branch !== 'refs/heads/production') {
    http_response_code(200);
    log_message('Skipping: not production branch');
    exit('Skipped');
}

log_message('Starting deploy...');

$commands = [
    "cd $repo_path && git pull origin production --quiet",
    "cd $repo_path && composer install --no-dev --quiet --optimize-autoloader",
    "cd $repo_path && php artisan migrate --force",
    "cd $repo_path && php artisan config:cache",
    "cd $repo_path && php artisan route:cache",
    "cd $repo_path && php artisan view:cache",
    "cd $repo_path && chmod -R 775 storage bootstrap/cache",
];

foreach ($commands as $cmd) {
    log_message("Running: $cmd");
    exec($cmd . ' 2>&1', $output, $return_code);
    $output_str = implode("\n", $output);
    log_message("Output: $output_str");
    
    if ($return_code !== 0) {
        log_message("Error: command failed with code $return_code");
        http_response_code(500);
        exit('Deploy failed');
    }
}

log_message('Deploy complete!');
http_response_code(200);
echo 'Deploy successful';
