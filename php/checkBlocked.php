<?php

include 'functions.php';

if (checkLogged() && checkRequest('GET')) {
    $blockerID = htmlspecialchars(intval($_SESSION['user_id']));
    $blockedID = htmlspecialchars(intval($_GET['blocked_id']));
    $w = STMT($conn, 'SELECT * FROM blocked WHERE blocker_id = ? AND blocked_id = ?', ['i', 'i'], [$blockerID, $blockedID]);
    if (isset($w['result'][0][0])) {
        echo json_encode(['blocked'=>true]);
    } else {
        echo json_encode(['blocked'=>false]);
    }
} else {
    sendHome();
}

$conn->close();
exit();
