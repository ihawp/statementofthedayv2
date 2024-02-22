<?php

include 'functions.php';

$postID = htmlspecialchars($_GET['post_id']);
$userID = $_SESSION['user_id'];
$likeSTR = 'like';

if (checkLogged() && checkRequest('GET')) {
    $w = STMT($conn, 'SELECT * FROM likes WHERE post_id = ? AND user_id = ? LIMIT 1', ['i', 'i'], [$postID, $userID]);
    if (isset($w['result'][0][0])) {
        $w = STMT($conn, 'DELETE FROM likes WHERE post_id = ? AND user_id = ?', ['i', 'i'], [$postID, $userID]);
        if ($w['result']) {
            STMT($conn, 'UPDATE posts SET likes = likes - 1 WHERE post_id = ?', ['i'], [$postID]);
            $c = STMT($conn, 'SELECT user_id FROM posts WHERE post_id = ?', ['i'], [$postID]);
            $userID2 = $c['result'][0][0];
            if (intval($_SESSION['user_id'] !== $userID2)) {
                $w = STMT($conn, 'DELETE FROM notifications WHERE username = ? AND post_id = ? AND noti_type = ?', ['s', 'i', 's'], [$_SESSION['username'], $postID, $likeSTR]);
                if ($w['result']) {
                    echo json_encode(['removed_like' => true]);
                }
            } else {
                echo json_encode(['removed_like' => true]);
            }
        } else {
            echo json_encode(['stmt' => false]);
        }
    } else {
        $w = STMT($conn, 'INSERT INTO likes (user_id, post_id, timestamp) VALUES (?, ?, NOW(6))', ['i', 'i'], [$userID, $postID]);
        if ($w['result']) {
            STMT($conn, 'UPDATE posts SET likes = likes + 1 WHERE post_id = ?', ['i'], [$postID]);
            $w = STMT($conn, 'SELECT user_id FROM posts WHERE post_id = ?', ['i'], [$postID]);
            if (isset($w['result'][0][0])) {
                $userID2 = $w['result'][0][0];
                if (intval($_SESSION['user_id'] !== $userID2)) {
                    $w = STMT($conn, 'INSERT INTO notifications (username, user_id, post_id, noti_type, timestamp) VALUES (?, ?, ?,?, NOW(6))', ['s', 'i', 'i', 's'], [$_SESSION['username'], $userID2, $postID, $likeSTR]);
                    if ($w['result']) {
                        echo json_encode(['like_added' => true]);
                    }
                } else {
                    echo json_encode(['like_added' => true]);
                }
            }
        } else {
            echo json_encode(['stmt' => false]);
        }
    }
} else {
    sendHome();
}

$conn->close();
exit();