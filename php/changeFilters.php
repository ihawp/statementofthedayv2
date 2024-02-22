<?php

include 'functions.php';

if (checkLogged() && checkRequest('GET')) {
    $filter = $_GET['filter'];
    $userID = intval($_SESSION['user_id']);
    $w = STMT($conn, "UPDATE accounts SET filters = JSON_ARRAY_APPEND(filters, '$', ?) WHERE id = ?", ['s', 'i'], [$filter, $userID]);
    if ($w['result']) {
        echo json_encode(['thisis'=>true]);
    } else {
        echo json_encode(['thisis'=>false]);
    }
} else {
    sendHome();
}

$conn->close();
exit();
