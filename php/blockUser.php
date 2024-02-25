<?php

include 'functions.php';

if (checkLogged() && checkRequest('GET')) {
    $blockerID = intval($_SESSION['user_id']);
    $blockedID = htmlspecialchars(intval($_GET['user_id']));
    if (isset(STMT($conn, 'SELECT * FROM blocked WHERE blocker_id = ? AND blocked_id = ?', ['i', 'i'] , [$blockerID, $blockedID])['result'][0][1])) {
        $w = STMT($conn, 'DELETE FROM blocked WHERE blocker_id = ? AND blocked_id = ?', ['i', 'i'] , [$blockerID, $blockedID]);
        if ($w['result']){
            echo json_encode(['stmt' => 'unblocked']);
        } else {
            echo json_encode(['stmt' => 'blocked']);
        }
    } else {
        $w = STMT($conn, 'INSERT INTO blocked (blocker_id, blocked_id, timestamp) VALUES (?,?,NOW(6))', ['i', 'i'] , [$blockerID, $blockedID]);
        if ($w['result']){
            $w = STMT($conn, 'SELECT * FROM follows WHERE followed_id = ? AND following_id = ?', ['i', 'i'], [$blockedID, $blockerID]);
            $wow = '';
            if (isset($w['result'][0][0])) {
                removeFollow($conn, $blockedID, $blockerID, $blockerID, 'follow');
                $wow = true;
            }
            echo json_encode(['stmt' => 'blocked', 'wow'=>$wow]);
        } else {
            echo json_encode(['stmt' => 'unblocked']);
        }
    }
} else {
    sendHome();
}

$conn->close();
exit();