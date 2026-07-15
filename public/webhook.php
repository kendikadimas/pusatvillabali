<?php

/**
 * GitHub Webhook for auto-deploy.
 * Uses git reset --hard to avoid divergent branch issues.
 */

$secret = 'pusatvillabali-deploy-secret-2024';
$logFile = __DIR__.'/../storage/logs/deploy.log';

// Verify GitHub signature
$signature = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';
$payload = file_get_contents('php://input');
$expected = 'sha256='.hash_hmac('sha256', $payload, $secret);

if (! hash_equals($expected, $signature)) {
    http_response_code(403);
    file_put_contents($logFile, date('[Y-m-d H:i:s] ')."Invalid signature\n", FILE_APPEND);
    echo 'Invalid signature';
    exit;
}

// Only deploy on push to production branch
$event = $_SERVER['HTTP_X_GITHUB_EVENT'] ?? '';
if ($event === 'ping') {
    echo 'pong';
    exit;
}

if ($event !== 'push') {
    echo 'Ignored event: '.$event;
    exit;
}

$data = json_decode($payload, true);
$ref = $data['ref'] ?? '';
if ($ref !== 'refs/heads/production') {
    file_put_contents($logFile, date('[Y-m-d H:i:s] ')."Skipping: not production branch ($ref)\n", FILE_APPEND);
    echo 'Skipped';
    exit;
}

// Deploy
$branch = 'production';
$repoDir = '/home/pusatvil/pusatvillabali';

file_put_contents($logFile, date('[Y-m-d H:i:s] ')."Starting deploy...\n", FILE_APPEND);

$commands = [
    "cd $repoDir && git fetch origin $branch --quiet",
    "cd $repoDir && git reset --hard origin/$branch --quiet",
    "cd $repoDir && php artisan config:clear",
    "cd $repoDir && php artisan config:cache",
    "cd $repoDir && php artisan view:clear",
    "cd $repoDir && php artisan route:clear",
];

foreach ($commands as $cmd) {
    file_put_contents($logFile, date('[Y-m-d H:i:s] ')."Running: $cmd\n", FILE_APPEND);
    exec($cmd.' 2>&1', $output, $code);
    if ($code !== 0) {
        file_put_contents($logFile, date('[Y-m-d H:i:s] ')."Error (code $code): ".implode("\n", $output)."\n", FILE_APPEND);
        http_response_code(500);
        echo 'Deploy failed';
        exit;
    }
}

file_put_contents($logFile, date('[Y-m-d H:i:s] ')."Deploy successful!\n", FILE_APPEND);
echo 'OK';
