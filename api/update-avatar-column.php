<?php
require_once 'config.php';

try {
    $pdo = getDB();
    
    // Добавляем поле avatar если его нет
    $stmt = $pdo->query("SHOW COLUMNS FROM users LIKE 'avatar'");
    $columnExists = $stmt->fetch();
    
    if (!$columnExists) {
        $pdo->exec("ALTER TABLE users ADD COLUMN avatar VARCHAR(255) NULL");
        echo "Поле avatar успешно добавлено в таблицу users";
    } else {
        echo "Поле avatar уже существует";
    }
    
} catch (Exception $e) {
    echo "Ошибка: " . $e->getMessage();
}
?>