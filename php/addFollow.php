<?php

include 'functions.php';

$userID = intval(htmlspecialchars($_SESSION['user_id']));
$uploadUserID = intval(htmlspecialchars($_GET['following']));

if ($uploadUserID === intval($_SESSION['user_id']) && checkLogged() && checkRequest('GET')) {
    $toBeFollowedID = intval(htmlspecialchars($_GET['followed']));
    $postID = $toBeFollowedID;
    $typeParam = 'follow';
    $w = STMT($conn, 'SELECT * FROM follows WHERE followed_id = ? AND following_id = ?', ['i', 'i'], [$toBeFollowedID, $uploadUserID]);
    if ($w['result'] === true) {
        if (addFollow($conn, $toBeFollowedID, $userID, $uploadUserID, $typeParam)) {
            echo json_encode(['following' => true]);
        } else {
            echo json_encode(['following' => false]);
        }
    } else {
        if (removeFollow($conn, $toBeFollowedID, $userID, $uploadUserID, $typeParam)) {
            echo json_encode(['unfollowed' => true]);
        } else {
            echo json_encode(['unfollowed' => false]);
        }
    }
} else {
    sendHome();
}
$conn->close();
exit();
