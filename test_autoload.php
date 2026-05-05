<?php
require_once __DIR__ . '/vendor/autoload.php';

echo "Testing autoload...\n";
echo "File exists: " . (file_exists(__DIR__ . '/app/Assets.php') ? 'yes' : 'no') . "\n";
echo "Class exists: " . (class_exists('CommerceKit\Commerce\Assets') ? 'yes' : 'no') . "\n";

// Try to manually include
echo "\nTrying manual include...\n";
require_once __DIR__ . '/app/Assets.php';
echo "After include - Class exists: " . (class_exists('CommerceKit\Commerce\Assets') ? 'yes' : 'no') . "\n";
