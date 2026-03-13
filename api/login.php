<?php
// CORS заголовки
header("Access-Control-Allow-Origin: https://s273934.h1n.ru");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Обработка preflight OPTIONS запроса
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/config.php';

$input = file_get_contents("php://input");
$data = json_decode($input);

if (!$data || !isset($data->email) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email и пароль обязательны']);
    exit;
}

try {
    $pdo = getDB();
    
    $stmt = $pdo->prepare("SELECT id, name, email, password, role FROM users WHERE email = ?");
    $stmt->execute([$data->email]);
    $user = $stmt->fetch();
    
    if (!$user || !password_verify($data->password, $user['password'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Неверный email или пароль']);
        exit;
    }
    
    $token = bin2hex(random_bytes(32));
    
    $stmt = $pdo->prepare("UPDATE users SET token = ? WHERE id = ?");
    $stmt->execute([$token, $user['id']]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Вход выполнен успешно',
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
            'token' => $token
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Ошибка сервера: ' . $e->getMessage()]);
}
?>