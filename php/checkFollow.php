<?php

include 'db_conn.php';
session_start();

$followedID = $_GET['followed_id'];
$followerID = $_GET['follower_id'];

$stmt = $conn->prepare('SELECT * FROM follows WHERE followed_id = ? AND following_id = ?');
$stmt->bind_param('ii',$followedID, $followerID);
if ($stmt->execute()) {
    $stmt->store_result();
    $r = $stmt->num_rows;
    $stmt->close();
    if ($r !== 0) {
        echo json_encode(['following'=>true]);
        exit();
    } else {
        echo json_encode(['following'=>false]);
        exit();
    }
}

$conn->close();
exit();