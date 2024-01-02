<?php
// ihawp

include 'db_conn.php';
include 'functions.php';

session_start();

if (isset($_POST['username']) && isset($_POST['password'])) {
    $username = htmlspecialchars($_POST['username']);
    $password = htmlspecialchars($_POST['password']);

    // Check if the username already exists in the database
    $stmtCheckUsername = $conn->prepare('SELECT username FROM accounts WHERE username = ?');
    $stmtCheckUsername->bind_param('s', $username);

    if ($stmtCheckUsername->execute()) {
        $stmtCheckUsername->store_result();

        if ($stmtCheckUsername->num_rows > 0) {
            // Username already in use
            $stmtCheckUsername->close();
            header('Location: ../index.html?error=usernamealreadyinuse');
            exit();
        }
    } else {
        // Handle the case where the query execution failed
        $stmtCheckUsername->close();
        header('Location: ../index.html?error=queryerror');
        exit();
    }

    $stmtCheckUsername->close();

    // Hash the password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Insert new user into the database
    $stmtInsertUser = $conn->prepare('INSERT INTO accounts (username, password, last_login, account_created) VALUES (?, ?, NOW(6), NOW(6))');
    $stmtInsertUser->bind_param('ss', $username, $hashedPassword);

    if ($stmtInsertUser->execute()) {
        $_SESSION['username'] = $username;
        $_SESSION['user_id'] = getUserID($conn);
        $stmtInsertUser->close();
        header('Location: ../index.html');
        exit();
    } else {
        // Handle the case where the insertion failed
        $stmtInsertUser->close();
        header('Location: ../index.html?error=insertionerror');
        exit();
    }
} else {
    header('Location: ../index.html');
    exit();
}

