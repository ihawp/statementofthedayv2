<?php

include 'db_conn.php';
session_start();

$parentID = htmlspecialchars($_POST['post_id']);
$userID = htmlspecialchars($_SESSION['user_id']);
$commentContent = htmlspecialchars($_POST['commentContent']);

$stmt = $conn->prepare('INSERT INTO posts (parent_post_id, user_id, username, content, time_posted) VALUES (?, ?, ?, ?, NOW(6))');
$stmt->bind_param('iiss', $parentID, $userID, $_SESSION['username'], $commentContent);
if ($stmt->execute()) {
    header('Location: ../index.html?page=post&post_id='.$parentID);
    exit();
} else {
    header('Location: ../index.html?page=home');
    exit();
}