<?php


// load notifications
// get all viewed and not_viewed notifications
// for the given user_id


// if loaded and viewed = 0
// set viewed to 1

include 'functions.php';

if (checkLogged() && checkRequest('GET')) {
    $data = array();
    $userID = intval($_SESSION['user_id']);
    $offset = htmlspecialchars($_GET['offset']);
    $w = STMT($conn, 'SELECT * FROM notifications WHERE user_id = ? ORDER BY timestamp DESC LIMIT 25 OFFSET ?', ['i','i'], [$userID, $offset]);
    if (isset($w['result'][0])) {
        foreach ($w['result'] as $key) {
            $data[] = [
                'id'=>$key[0],
                'user_id'=>$key[1],
                'post_id'=>$key[2],
                'username'=>$key[3],
                'noti_type'=>$key[4],
                'viewed'=>$key[5],
                'timestamp'=>$key[6]
            ];
            if ($key[5] === 0) {
                $id = $key[0];
                STMT($conn, 'UPDATE notifications SET viewed = 1 WHERE id = ?', ['i'], [$id]);
            }
        }
    }
    echo json_encode($data);
} else {
    sendHome();
}