<?php


include 'db_conn.php';
session_start();

$userID = intval($_SESSION['user_id']);

$stmt = $conn->prepare('SELECT filters FROM accounts WHERE id = ?');
$stmt->bind_param('i', $userID);
if ($stmt->execute()) {
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
        echo json_encode(json_decode($row['filters']));
        exit();
    }
}