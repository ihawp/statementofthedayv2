<?php
// ihawp

include 'db_conn.php';
include 'functions.php';

session_start();

if (isset($_POST['loginusername']) && isset($_POST['loginpassword'])) {
    $username = htmlspecialchars($_POST['loginusername']);
    $password = htmlspecialchars($_POST['loginpassword']);

    $stmt = $conn->prepare('SELECT password, id, username FROM accounts WHERE username = ?');
    $stmt->bind_param('s', $username);

    if ($stmt->execute()) {
        $stmt->bind_result($passwordResult, $idResult, $usernameResult);

        // need to add timestamp to db for login time.
        // add it here

        if ($stmt->fetch()) {
            if (password_verify($password, $passwordResult)) {
                $_SESSION['username'] = $usernameResult;
                $_SESSION['user_id'] = $idResult;
                header('Location: ../index.html?page=home');
                exit();
            } else {
                header('Location: ../index.html?error=wrongpassword&page=login');
                exit();
            }
        } else {
            header('Location: ../index.html?error=usernotfound&page=login');
            exit();
        }
    } else {
        header('Location: ../index.html?error=queryerror&page=login');
        exit();
    }
    $stmt->close();
}