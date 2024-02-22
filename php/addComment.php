<?php

include 'functions.php';

$commentContent = htmlspecialchars($_POST['commentContent']);
if ($commentContent.ob_get_length() <= 0) {
    header("Location: ../index.html?page=home&viewing_post=true&post_id=$parentID&error=accidentalclick");
    $conn->close();
    exit();
}

if (checkLogged() && checkRequest('POST')) {
    $parentID = htmlspecialchars($_POST['post_id']);
    $usernamee = htmlspecialchars($_SESSION['username']);
    $userID = htmlspecialchars($_SESSION['user_id']);
    $type = 'comment';
    $w = STMT($conn, 'SELECT super_parent_post_id FROM posts WHERE post_id = ? LIMIT 1', ['i'], [$parentID]);
    $check = $w['result'][0][0];
    if ($check === 0) {
        $superParentID = $parentID;
    } else {
        $superParentID = $check;
    }
    STMT($conn, 'INSERT INTO posts (parent_post_id, super_parent_post_id, user_id, username, content, time_posted) VALUES (?, ?, ?, ?, ?, NOW(6))', ['i', 'i', 'i', 's', 's'], [$parentID, $superParentID, $userID, $_SESSION['username'], $commentContent]);
    $w = STMT($conn, 'UPDATE posts SET comments = comments + 1 WHERE post_id = ?', ['i'], [$parentID]);
    if ($w['result']) {
        $w = STMT($conn, 'SELECT user_id FROM posts WHERE post_id = ?', ['i'], [$parentID]);
        if ($w['result'][0][0] && $userIDD = $w['result'][0][0]) {
            $w = STMT($conn, 'SELECT post_id FROM posts WHERE user_id = ? ORDER BY time_posted DESC LIMIT 1', ['i'], [$userID]);
            if ($w['result'][0][0]) {
                $properID = $w['result'][0][0];
                if ($userIDD !== $_SESSION['user_id']) {
                    $w = STMT($conn, 'INSERT INTO notifications (user_id, post_id, username, noti_type, timestamp) VALUES (?,?,?,?,NOW(6))', ['i', 'i', 's', 's'], [$userIDD, $properID, $usernamee, $type]);
                    if ($w['result']) {
                        header('Location: ../index.html?page=home&post_id=' . $parentID.'&viewing_post=true');
                    }
                } else {
                    header('Location: ../index.html?page=home&post_id=' . $parentID.'&viewing_post=true');
                }
            }
        }
    } else {
        header('Location: ../index.html?page=home');
    }
} else {
    sendHome();
}

$conn->close();
exit();