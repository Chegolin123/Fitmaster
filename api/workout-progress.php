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
    $method = $_SERVER['REQUEST_METHOD'];
    
    // Создаем таблицы если их нет
    $pdo->exec("CREATE TABLE IF NOT EXISTS workout_progress (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        workout_id INT NOT NULL,
        workout_name VARCHAR(255) NOT NULL,
        calories INT NOT NULL,
        duration INT NOT NULL,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )");
    
    $pdo->exec("CREATE TABLE IF NOT EXISTS workout_popularity (
        workout_id INT PRIMARY KEY,
        workout_name VARCHAR(255) NOT NULL,
        completions INT DEFAULT 0,
        total_calories INT DEFAULT 0,
        total_duration INT DEFAULT 0,
        last_completed TIMESTAMP NULL
    )");
    
    if ($method == 'POST') {
        $input = file_get_contents("php://input");
        $data = json_decode($input);
        
        if (!isset($data->workout_id) || !isset($data->workout_name) || !isset($data->calories) || !isset($data->duration)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Не все данные предоставлены']);
            exit;
        }
        
        $pdo->beginTransaction();
        
        try {
            $stmt = $pdo->prepare("INSERT INTO workout_progress (user_id, workout_id, workout_name, calories, duration) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$userId, $data->workout_id, $data->workout_name, $data->calories, $data->duration]);
            
            $stmt = $pdo->prepare("INSERT INTO workout_popularity (workout_id, workout_name, completions, total_calories, total_duration, last_completed) 
                                  VALUES (?, ?, 1, ?, ?, NOW())
                                  ON DUPLICATE KEY UPDATE 
                                  completions = completions + 1,
                                  total_calories = total_calories + ?,
                                  total_duration = total_duration + ?,
                                  last_completed = NOW()");
            $stmt->execute([
                $data->workout_id, 
                $data->workout_name, 
                $data->calories, 
                $data->duration,
                $data->calories,
                $data->duration
            ]);
            
            $pdo->commit();
            
            echo json_encode(['success' => true, 'message' => 'Прогресс сохранен']);
            
        } catch (Exception $e) {
            $pdo->rollBack();
            throw $e;
        }
        
    } elseif ($method == 'GET') {
        $action = isset($_GET['action']) ? $_GET['action'] : '';
        
        if ($action == 'popular') {
            $stmt = $pdo->query("SELECT workout_id, workout_name, completions, total_calories, total_duration, last_completed 
                                FROM workout_popularity 
                                ORDER BY completions DESC 
                                LIMIT 10");
            $popular = $stmt->fetchAll();
            
            echo json_encode([
                'success' => true,
                'popular_workouts' => $popular
            ]);
            
        } else {
            $stmt = $pdo->prepare("SELECT 
                COUNT(*) as total_workouts,
                SUM(calories) as total_calories,
                SUM(duration) as total_duration,
                MAX(completed_at) as last_workout
                FROM workout_progress 
                WHERE user_id = ?");
            $stmt->execute([$userId]);
            $stats = $stmt->fetch();
            
            $stmt = $pdo->prepare("SELECT workout_name, calories, duration, completed_at 
                                  FROM workout_progress 
                                  WHERE user_id = ? 
                                  ORDER BY completed_at DESC 
                                  LIMIT 5");
            $stmt->execute([$userId]);
            $recent = $stmt->fetchAll();
            
            echo json_encode([
                'success' => true,
                'stats' => [
                    'total_workouts' => (int)($stats['total_workouts'] ?? 0),
                    'total_calories' => (int)($stats['total_calories'] ?? 0),
                    'total_duration' => (int)($stats['total_duration'] ?? 0),
                    'last_workout' => $stats['last_workout'] ?? null
                ],
                'recent_workouts' => $recent
            ]);
        }
    }
    
} catch (Exception $e) {
    if ($pdo && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Ошибка сервера: ' . $e->getMessage()]);
}
?>