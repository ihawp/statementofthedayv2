<?php
// ihawp

include 'db_conn.php';
include 'functions.php';

session_start();

if (isset($_POST['username']) && isset($_POST['password'])) {
    $username = htmlspecialchars($_POST['username']);
    $password = htmlspecialchars($_POST['password']);

    $stmtCheckUsername = $conn->prepare('SELECT username FROM accounts WHERE username = ?');
    $stmtCheckUsername->bind_param('s', $username);

    if ($stmtCheckUsername->execute()) {
        $stmtCheckUsername->store_result();

        if ($stmtCheckUsername->num_rows > 0) {
            $stmtCheckUsername->close();
            header('Location: ../index.html?error=usernamealreadyinuse&page=register');
            exit();
        }
    } else {
        $stmtCheckUsername->close();
        header('Location: ../index.html?error=queryerror&page=register');
        exit();
    }

    $stmtCheckUsername->close();
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    $stmtInsertUser = $conn->prepare('INSERT INTO accounts (username, password, last_login, account_created) VALUES (?, ?, NOW(6), NOW(6))');
    $stmtInsertUser->bind_param('ss', $username, $hashedPassword);

    if ($stmtInsertUser->execute()) {
        $_SESSION['username'] = $username;
        $_SESSION['user_id'] = getUserID($conn);
        $_SESSION['pfp'] = 'default.png';
        $stmtInsertUser->close();
        header('Location: ../index.html?page=home');
        exit();
    } else {
        $stmtInsertUser->close();
        header('Location: ../index.html?error=insertionerror&page=register');
        exit();
    }
} else {
    header('Location: ../index.html?page=register');
    exit();
}

