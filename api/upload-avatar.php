<?php
header("Access-Control-Allow-Origin: https://s273934.h1n.ru");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Не авторизован']);
    exit;
}

try {
    $pdo = getDB();
    
    $stmt = $pdo->query("SHOW COLUMNS FROM users LIKE 'avatar'");
    $columnExists = $stmt->fetch();
    
    if (!$columnExists) {
        $pdo->exec("ALTER TABLE users ADD COLUMN avatar VARCHAR(255) NULL");
    }
    
    $stmt = $pdo->prepare("SELECT id FROM users WHERE token = ?");
    $stmt->execute([$token]);
    $user = $stmt->fetch();
    
    if (!$user) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Пользователь не найден']);
        exit;
    }
    
    $userId = $user['id'];
    
    if (!isset($_FILES['avatar']) || $_FILES['avatar']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Файл не загружен']);
        exit;
    }
    
    $file = $_FILES['avatar'];
    
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($mimeType, $allowedTypes)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Разрешены только изображения (JPEG, PNG, GIF, WEBP)']);
        exit;
    }
    
    if ($file['size'] > 5 * 1024 * 1024) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Файл слишком большой. Максимальный размер 5MB']);
        exit;
    }
    
    $uploadDir = __DIR__ . '/../uploads/avatars/';
    if (!file_exists($uploadDir)) {
        if (!mkdir($uploadDir, 0777, true)) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Не удалось создать директорию для загрузки']);
            exit;
        }
    }
    
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = 'avatar_' . $userId . '_' . time() . '.' . $extension;
    $filepath = $uploadDir . $filename;
    
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        $stmt = $pdo->prepare("SELECT avatar FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $oldAvatar = $stmt->fetchColumn();
        
        if ($oldAvatar) {
            $oldFilePath = __DIR__ . '/..' . $oldAvatar;
            if (file_exists($oldFilePath)) {
                unlink($oldFilePath);
            }
        }
        
        $avatarUrl = '/uploads/avatars/' . $filename;
        $stmt = $pdo->prepare("UPDATE users SET avatar = ? WHERE id = ?");
        $stmt->execute([$avatarUrl, $userId]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Аватар успешно загружен',
            'avatar_url' => $avatarUrl
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Ошибка при сохранении файла']);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Ошибка сервера: ' . $e->getMessage()]);
}
?>