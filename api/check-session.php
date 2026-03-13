<?php
header("Access-Control-Allow-Origin: http://s273934.h1n.ru");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/config.php';

$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';

$token = '';
if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
    $token = $matches[1];
}

if (empty($token)) {
    echo json_encode([
        'success' => false,
        'message' => 'Токен не предоставлен',
        'session_exists' => false
    ]);
    exit;
}

try {
    $pdo = getDB();
    
    $stmt = $pdo->prepare("SELECT id, name, email, role FROM users WHERE token = ?");
    $stmt->execute([$token]);
    $user = $stmt->fetch();
    
    if ($user) {
        echo json_encode([
            'success' => true,
            'message' => 'Сессия активна',
            'session_exists' => true,
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role']
            ]
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Сессия не найдена',
            'session_exists' => false
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Ошибка сервера',
        'session_exists' => false
    ]);
}
?>