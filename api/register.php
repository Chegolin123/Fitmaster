<?php
header("Access-Control-Allow-Origin: https://s273934.h1n.ru");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/config.php';

$input = file_get_contents("php://input");
$data = json_decode($input);

if (!$data || !isset($data->nickname) || !isset($data->email) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Все поля обязательны']);
    exit;
}

$nickname = trim($data->nickname);
$email = trim($data->email);
$password = $data->password;

if (strlen($nickname) < 3) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Никнейм должен быть минимум 3 символа']);
    exit;
}

if (!preg_match('/^[a-zA-Z0-9_]+$/', $nickname)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Никнейм может содержать только буквы, цифры и подчеркивание']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Неверный формат email']);
    exit;
}

if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Пароль должен быть минимум 6 символов']);
    exit;
}

try {
    $pdo = getDB();
    
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Email уже зарегистрирован']);
        exit;
    }
    
    $stmt = $pdo->prepare("SELECT id FROM users WHERE name = ?");
    $stmt->execute([$nickname]);
    if ($stmt->fetch()) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Никнейм уже занят']);
        exit;
    }
    
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $token = bin2hex(random_bytes(32));
    
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password, token, role) VALUES (?, ?, ?, ?, 'user')");
    $stmt->execute([$nickname, $email, $hashedPassword, $token]);
    
    $userId = $pdo->lastInsertId();
    
    echo json_encode([
        'success' => true,
        'message' => 'Регистрация успешна',
        'user' => [
            'id' => $userId,
            'name' => $nickname,
            'email' => $email,
            'role' => 'user',
            'token' => $token
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Ошибка сервера: ' . $e->getMessage()]);
}
?>