<?php

include 'db_conn.php';
session_start();

$blockerID = intval($_SESSION['user_id']);
$blockedID = htmlspecialchars(intval($_GET['user_id']));


// check blocked

$stmt = $conn->prepare('SELECT * FROM blocked WHERE blocker_id = ? AND blocked_id = ?');
$stmt->bind_param('ii', $blockerID, $blockedID);
if ($stmt->execute()) {
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    if (isset($row['id'])) {
        $stmt = $conn->prepare('DELETE FROM blocked WHERE blocker_id = ? AND blocked_id = ?');
        $stmt->bind_param('ii',$blockerID, $blockedID);
        if ($stmt->execute()) {
            echo json_encode(['stmt'=>'unblocked']);
            $stmt->close();
            $conn->close();
            exit();
        }
    } else {
        $stmt = $conn->prepare('INSERT INTO blocked (blocker_id, blocked_id, timestamp) VALUES (?,?,NOW(6))');
        $stmt->bind_param('ii',$blockerID, $blockedID);
        if ($stmt->execute()) {
            echo json_encode(['stmt'=>'blocked']);
            $stmt->close();
            $conn->close();
            exit();
        }
    }
}