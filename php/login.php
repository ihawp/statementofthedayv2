<?php

include 'functions.php';

if (checkRequest('POST')) {
    $username = htmlspecialchars($_POST['loginusername']);
    $password = htmlspecialchars($_POST['loginpassword']);

    $w = STMT($conn, 'SELECT password, id, username, pfp FROM accounts WHERE username = ?', ['s'], [$username]);

    if (isset($w['result'][0][0]) && $c = $w['result'][0]) {
        $passwordResult = $c[0];
        $idResult = $c[1];
        $usernameResult = $c[2];
        $pfp = $c[3];
        if (password_verify($password, $passwordResult)) {
            $_SESSION['username'] = $usernameResult;
            $_SESSION['user_id'] = $idResult;
            $_SESSION['pfp']=$pfp;

            $w = STMT($conn, 'UPDATE accounts SET last_login = NOW(6) WHERE id = ?', ['i'], [$_SESSION['user_id']]);
            if ($w['result']) {
                header('Location: ../index.html?page=home');
            } else {
                header('Location: ../index.html?error=wrongpassword&page=login');
            }
        } else {
            header('Location: ../index.html?error=wrongpassword&page=login');
        }
    } else {
        header('Location: ../index.html?error=wrongpassword&page=login');
    }
} else {
    sendHome();
}

$conn->close();
exit();
