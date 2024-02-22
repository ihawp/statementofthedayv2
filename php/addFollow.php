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
            $w = STMT($conn, 'INSERT INTO follows (followed_id, following_id, timestamp) VALUES (?, ?, NOW(6))', ['i', 'i'], [$toBeFollowedID, $uploadUserID]);
            if ($w['result']) {
                STMT($conn, 'UPDATE accounts SET following_count = following_count + 1 WHERE id = ?', ['i'], [$uploadUserID]);
                STMT($conn, 'UPDATE accounts SET follow_count = follow_count + 1 WHERE id = ?', ['i'], [$uploadUserID]);
                $w = STMT($conn, 'SELECT username FROM accounts WHERE id = ? LIMIT 1', ['i'], [$userID]);
                if ($w['result'][0][0]) {
                    $followingUsername = strval($w['result'][0][0]);
                    $w = STMT($conn, 'INSERT INTO notifications (username, user_id, post_id, noti_type, timestamp) VALUES (?, ?, ?,?, NOW(6))', ['s', 'i', 'i', 's'], [$followingUsername, $toBeFollowedID, $userID, $typeParam]);
                    if ($w['result']) {
                        echo json_encode(['following' => true]);
                    } else {
                        echo json_encode(['following' => false]);
                    }
                } else {
                    echo json_encode(['following' => false]);
                }
            }
    } else {
        $w = STMT($conn, 'DELETE FROM follows WHERE followed_id = ? AND following_id = ?', ['i', 'i'], [$toBeFollowedID, $uploadUserID]);
        if ($w['result']) {
            STMT($conn, 'UPDATE accounts SET following_count = following_count - 1 WHERE id = ?', ['i'], [$uploadUserID]);
            STMT($conn, 'UPDATE accounts SET follow_count = follow_count - 1 WHERE id = ?', ['i'], [$toBeFollowedID]);
            $w = STMT($conn, 'SELECT username FROM accounts WHERE id = ? LIMIT 1', ['i'], [$userID]);
            if ($w['result'][0][0]) {
                $followingUsername = strval($w['result'][0][0]);

                $stmt = $conn->prepare('DELETE FROM notifications WHERE user_id = ? AND noti_type = ? AND username = ?');
                $stmt->bind_param('iss', $toBeFollowedID, $typeParam, $followingUsername);

                $w = STMT($conn, 'DELETE FROM notifications WHERE user_id = ? AND noti_type = ? AND username = ?', ['i', 's', 's'], [$toBeFollowedID, $typeParam, $followingUsername]);

                if ($w['result'] === true) {
                    echo json_encode(['unfollowed' => true]);
                } else {
                    echo json_encode(['unfollowed' => false]);
                }
            } else {
                echo json_encode(['unfollowed' => false]);
            }
        }
    }
} else {
    sendHome();
}
$conn->close();
exit();
