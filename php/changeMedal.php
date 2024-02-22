<?php

include 'functions.php';

if (checkLogged() && checkRequest('POST')) {
    $medalId = htmlspecialchars($_POST['medal_id']);
    $accountId = $_SESSION['user_id'];
    $w = STMT($conn, 'SELECT * FROM medals WHERE id = ?', ['i'], [$medalId]);
    if ($w['result'][0][0]) {
        $resultMedal = $w['result'][0];
        $wow = json_encode($resultMedal);
        $w = STMT($conn, 'UPDATE accounts SET medal_selection = ? WHERE id = ?', ['s', 'i'], [$wow, $accountId]);
        if ($w['result']) {
            echo json_encode(['stmt' => true]);
        } else {
            echo json_encode(['stmt'=>false]);
        }
    } else {
        echo json_encode(['stmt'=>false]);
    }
} else {
    sendHome();
}

$conn->close();
exit();