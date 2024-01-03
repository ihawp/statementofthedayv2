<?php

include 'db_conn.php';
session_start();

$postID = htmlspecialchars($_GET['post_id']);

if ($_SERVER['HTTP_REQUEST_METHOD'] === 'GET') {
    echo json_encode(['stmt'=>true]);
    exit();
}

// check if post is already liked by user
$stmt = $conn->prepare('SELECT post_id, user_id FROM likes WHERE post_id = ? AND user_id = ?');
$stmt->bind_param('ii', $postID, $_SESSION['user_id']);
if ($stmt->execute()) {
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        echo json_encode(['already_liked' => true]);
        exit();
    }
} else {
    echo json_encode(['stmt'=>false]);
    $conn->close();
    exit();
}

// insert into likes if not liked already
$stmt2 = $conn->prepare('INSERT INTO likes (user_id, post_id, timestamp) VALUES (?, ?, NOW(6))');
$stmt2->bind_param('ii', $_SESSION['user_id'], $postID);
if ($stmt2->execute()) {
    echo json_encode(['like_added'=>true]);
} else {
    echo json_encode(['stmt'=>false]);
}

$conn->close();
exit();