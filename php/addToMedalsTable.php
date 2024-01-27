<?php


include 'db_conn.php';
session_start();

$post_id = 520;
$user_id = 66;
$placement = 1;

$stmt = $conn->prepare('INSERT INTO medals (post_id, user_id, placement, timestamp) VALUES (?,?,?,NOW(6))');
$stmt->bind_param('iii', $post_id, $user_id, $placement);
if ($stmt->execute()) {
    echo 'inserted success!';
}