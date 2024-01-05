<?php

include 'db_conn.php';
session_start();

$userID = htmlspecialchars($_GET['user_id']);
$postID = htmlspecialchars($_GET['post_id']);

$stmt = $conn->prepare('DELETE FROM posts WHERE post_id = ? AND user_id = ?');
$stmt->bind_param('ii', $postID, $_SESSION['user_id']);
if (intval($userID) === $_SESSION['user_id']) {
    if ($stmt->execute()) {
        echo json_encode(['post_deleted'=>true]);
    } else {
        echo json_encode(['stmt'=>false]);
    }
} else {
    echo json_encode(['stmt'=>$userID, 'stmtt'=>$_SESSION['user_id']]);
}