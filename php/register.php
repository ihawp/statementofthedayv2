<?php
// ihawp

include 'db_conn.php';
include 'functions.php';

session_start();

if (isset($_POST['username']) && isset($_POST['password'])) {
    $username = htmlspecialchars($_POST['username']);
    $password = htmlspecialchars($_POST['password']);

    // check if username already in db

    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $conn->prepare('INSERT INTO accounts (username, password, last_login, account_created) VALUES (?, ?, NOW(6), NOW(6))');
    $stmt->bind_param('ss', $username, $hashedPassword);
    if ($stmt->execute()) {
        $_SESSION['username'] = $username;
        $_SESSION['user_id'] = getUserID($conn);
        header('Location: app.php');
        exit();
    } else {
        header('Location: ../html/index.html');
        exit();
    }
} else {
    header('Location: ../html/index.html');
    exit();
}