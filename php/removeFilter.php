<?php


include 'db_conn.php';
session_start();

$userID = intval($_SESSION['user_id']);
$filter = $_GET['filter'];

$stmt = $conn->prepare("UPDATE accounts SET filters = JSON_REMOVE(filters, JSON_UNQUOTE(JSON_SEARCH(filters, 'one', ?))) WHERE id = ?");
$stmt->bind_param('si', $filter, $userID);
if ($stmt->execute()) {
    echo json_encode(['wow'=>true]);
} else {
    echo json_encode(['wow'=>false]);
}