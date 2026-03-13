<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'chegolin'); // Ваш пользователь БД
define('DB_PASS', '730639779Qq'); // Пароль от БД
define('DB_NAME', 'fitmaster'); // Имя базы данных

function getDB() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS
        );
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        return $pdo;
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Ошибка подключения к БД']);
        exit;
    }
}
?>