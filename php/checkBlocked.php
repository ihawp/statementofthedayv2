<?php

include 'db_conn.php';
session_start();

$blockerID = htmlspecialchars(intval($_SESSION['user_id']));
$blockedID = htmlspecialchars(intval($_GET['blocked_id']));

$stmt = $conn->prepare('SELECT * FROM blocked WHERE blocker_id = ? AND blocked_id = ?');
$stmt->bind_param('ii', $blockerID, $blockedID);
if ($stmt->execute()) {
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    if (isset($row['id'])) {
        echo json_encode(['blocked'=>true]);
    } else {
        echo json_encode(['blocked'=>false]);
    }
}
