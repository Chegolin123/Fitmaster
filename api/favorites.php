<?php
header("Access-Control-Allow-Origin: https://s273934.h1n.ru");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
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
    
    $stmt = $pdo->prepare("SELECT id FROM users WHERE token = ?");
    $stmt->execute([$token]);
    $user = $stmt->fetch();
    
    if (!$user) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Пользователь не найден']);
        exit;
    }
    
    $userId = $user['id'];
    
    $pdo->exec("CREATE TABLE IF NOT EXISTS user_favorites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        workout_id INT NOT NULL,
        workout_name VARCHAR(255) NOT NULL,
        workout_image VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_favorite (user_id, workout_id)
    )");
    
    $method = $_SERVER['REQUEST_METHOD'];
    
    if ($method == 'POST') {
        $input = file_get_contents("php://input");
        $data = json_decode($input);
        
        if (!isset($data->workout_id) || !isset($data->workout_name)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Не все данные предоставлены']);
            exit;
        }
        
        $stmt = $pdo->prepare("SELECT id FROM user_favorites WHERE user_id = ? AND workout_id = ?");
        $stmt->execute([$userId, $data->workout_id]);
        
        if ($stmt->fetch()) {
            echo json_encode(['success' => false, 'message' => 'Тренировка уже в избранном']);
            exit;
        }
        
        $stmt = $pdo->prepare("INSERT INTO user_favorites (user_id, workout_id, workout_name, workout_image) VALUES (?, ?, ?, ?)");
        $stmt->execute([$userId, $data->workout_id, $data->workout_name, $data->workout_image ?? null]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Тренировка добавлена в избранное'
        ]);
        
    } elseif ($method == 'DELETE') {
        $workoutId = isset($_GET['workout_id']) ? $_GET['workout_id'] : null;
        
        if (!$workoutId) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID тренировки не указан']);
            exit;
        }
        
        $stmt = $pdo->prepare("DELETE FROM user_favorites WHERE user_id = ? AND workout_id = ?");
        $stmt->execute([$userId, $workoutId]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Тренировка удалена из избранного'
        ]);
        
    } elseif ($method == 'GET') {
        $stmt = $pdo->prepare("SELECT workout_id, workout_name, workout_image, created_at FROM user_favorites WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute([$userId]);
        $favorites = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'favorites' => $favorites
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Ошибка сервера: ' . $e->getMessage()]);
}
?>