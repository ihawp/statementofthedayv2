<?php

include 'functions.php';

if (checkRequest('POST')) {
    $username = htmlspecialchars($_POST['username']);
    $password = htmlspecialchars($_POST['password']);
    $w = STMT($conn, 'SELECT username FROM accounts WHERE username = ?', ['s'], [$username]);
    if (isset($w['result'][0][0])) {
        header('Location: ../index.html?error=usernamealreadyinuse&page=register');
    } else {
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        $w = STMT($conn, 'INSERT INTO accounts (username, password, last_login, account_created) VALUES (?, ?, NOW(6), NOW(6))', ['s','s'], [$username, $hashedPassword]);
        if ($w['result']) {
            $_SESSION['username'] = $username;
            $w = STMT($conn, 'SELECT id FROM accounts WHERE username = ?', ['s'], [$_SESSION['username']]);
            if (isset($w['result'][0][0])) {
                $_SESSION['user_id'] = $w['result'][0][0];
            }
            $_SESSION['pfp'] = 'default.png';
            header('Location: ../index.html?page=home');
        } else {
            header('Location: ../index.html?error=insertionerror&page=register');
        }
    }
} else {
    sendHome();
}

$conn->close();
exit();