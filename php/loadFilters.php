<?php


include 'functions.php';

if (checkLogged() && checkRequest('GET')) {
    $userID = intval($_SESSION['user_id']);
    $w = STMT($conn, 'SELECT filters FROM accounts WHERE id = ?', ['i'], [$userID]);
    if (isset($w['result'][0][0])) {
        echo json_encode(json_decode($w['result'][0][0]));
    }
} else {
    sendHome();
}

$conn->close();
exit();