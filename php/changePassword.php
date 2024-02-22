<?php

include 'functions.php';

if (checkLogged() && checkRequest('POST')) {
    $password = htmlspecialchars($_POST['password']);
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    $userID = intval($_SESSION['user_id']);
    $w = STMT($conn, 'UPDATE accounts SET password = ? WHERE id = ?', ['s', 'i'], [$hashedPassword, $userID]);
    if ($w['result']) {
        header('Location: ../index.html?page=settings');
    } else {
        header('Location: ../index.html?page=settings&failed=true');
    }
} else {
    sendHome();
}

$conn->close();
exit();