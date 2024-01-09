<?php

include 'db_conn.php';
session_start();

$userID = htmlspecialchars($_GET['user_id']);
$postID = htmlspecialchars($_GET['post_id']);

// Check if it's a comment
$stmtCheckComment = $conn->prepare('SELECT parent_post_id FROM posts WHERE post_id = ? LIMIT 1');
$stmtCheckComment->bind_param('i', $postID);
$stmtCheckComment->execute();
$resultCheckComment = $stmtCheckComment->get_result();
$rowCheckComment = $resultCheckComment->fetch_assoc();

if ($rowCheckComment && $rowCheckComment['parent_post_id'] !== null) {
    $parentPostID = $rowCheckComment['parent_post_id'];
    $stmtDecrementCommentCount = $conn->prepare('UPDATE posts SET comments = comments - 1 WHERE post_id = ?');
    $stmtDecrementCommentCount->bind_param('i', $parentPostID);
    $stmtDecrementCommentCount->execute();
}

$stmt = $conn->prepare('DELETE FROM posts WHERE post_id = ? AND user_id = ? OR parent_post_id = ? OR super_parent_post_id = ?');
$stmt->bind_param('iiii', $postID, $_SESSION['user_id'], $postID, $postID);

if (intval($userID) === $_SESSION['user_id']) {
    if ($stmt->execute()) {
        echo json_encode(['post_deleted' => true]);
    } else {
        echo json_encode(['stmt' => false]);
    }
} else {
    echo json_encode(['stmt' => $userID, 'stmtt' => $_SESSION['user_id']]);
}