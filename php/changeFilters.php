<?php

include 'db_conn.php';
session_start();

$filter = $_GET['filter'];
$userID = intval($_SESSION['user_id']);

$stmt = $conn->prepare("UPDATE accounts SET filters = JSON_ARRAY_APPEND(filters, '$', ?) WHERE id = ?");
$stmt->bind_param('si', $filter, $userID);
if ($stmt->execute()) {
    echo json_encode(['thisis'=>true]);
} else {
    echo json_encode(['thisis'=>false]);
}
