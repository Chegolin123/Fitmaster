<?php
require_once 'cors.php';

echo json_encode([
    'success' => true,
    'message' => 'API работает!',
    'time' => date('Y-m-d H:i:s'),
    'server' => $_SERVER['SERVER_NAME']
]);
?>