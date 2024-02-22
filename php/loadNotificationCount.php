<?php

include 'functions.php';

if (checkLogged() && checkRequest('GET')) {
    $userID = $_SESSION['user_id'];
    $data = array();
    $w = STMT($conn, 'SELECT viewed, timestamp FROM notifications WHERE user_id = ? AND viewed = 0 LIMIT 100', ['i'], [$userID]);
    if ($w['result']) {
        foreach ($w['result'] as $key) {
            $data[] = [
                'viewed'=>$key[0]
            ];
        }
        $ww = count($data);
        echo json_encode(['count'=>$ww]);
    }
} else {
    sendHome();
}

$conn->close();
exit();