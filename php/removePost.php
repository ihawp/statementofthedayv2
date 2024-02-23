<?php

include 'functions.php';

if (checkLogged() && checkRequest('GET')) {
    $userID = htmlspecialchars($_GET['user_id']);
    $postID = htmlspecialchars($_GET['post_id']);
    $username = $_SESSION['username'];

    $w = STMT($conn, 'SELECT parent_post_id FROM posts WHERE post_id = ? LIMIT 1', ['i'], [$postID]);
    if (isset($w['result'][0][0]) && $parentPostID = $w['result'][0][0]) {
        $noti_type = 'comment';
        STMT($conn, 'UPDATE posts SET comments = comments - 1 WHERE post_id = ?', ['i'], [$parentPostID]);
        STMT($conn, 'DELETE FROM notifications WHERE post_id = ? AND username = ? AND noti_type = ?', ['i','s','s'], [$parentPostID, $username, $noti_type]);
    }

    if (intval($userID) === $_SESSION['user_id']) {
        $w = STMT($conn, 'DELETE FROM posts WHERE post_id = ? AND user_id = ? OR parent_post_id = ? OR super_parent_post_id = ?', ['i','i','i','i'], [$postID, $_SESSION['user_id'], $postID, $postID]);
        if ($w['result']) {
            echo json_encode(['post_deleted' => true]);
        } else {
            echo json_encode(['stmt' => false]);
        }
    }
} else {
    sendHome();
}

$conn->close();
exit();