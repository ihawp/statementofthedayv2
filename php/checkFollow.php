<?php

include 'functions.php';

if (checkLogged() && checkRequest('GET')) {
    $followedID = htmlspecialchars($_GET['followed_id']);
    $followerID = htmlspecialchars($_GET['follower_id']);
    $w = STMT($conn, 'SELECT * FROM follows WHERE followed_id = ? AND following_id = ?', ['i', 'i'], [$followedID, $followerID]);
    if (isset($w['result'][0][0])) {
        echo json_encode(['following' => true]);
    } else {
        echo json_encode(['following'=>false]);
    }
} else {
    sendHome();
}

$conn->close();
exit();