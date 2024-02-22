<?php

include 'functions.php';

if (checkLogged() && checkRequest('GET')) {
    $userID = intval($_SESSION['user_id']);
    $wow = Array();
    $w = STMT($conn, 'SELECT * FROM medals WHERE user_id = ?', ['i'], [$userID]);
    if (isset($w['result'][0])) {
        $i = 0;
        foreach ($w['result'] as $key) {
            $row = $w['result'][$i];
            $wow[] = [
                'id'=>$row[0],
                'post_id'=>$row[1],
                'user_id'=>$row[2],
                'placement'=>$row[3],
                'timestamp'=>$row[5]
            ];
            $i++;
        }
    }
    echo json_encode($wow);
} else {
    sendHome();
}

$conn->close();
exit();