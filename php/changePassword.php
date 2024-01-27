<?php


$password = htmlspecialchars($_POST['password']);
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

include 'db_conn.php';
session_start();

$userID = intval($_SESSION['user_id']);

$stmt = $conn->prepare('UPDATE accounts SET password = ? WHERE id = ?');
$stmt->bind_param('si',$hashedPassword, $userID);
if ($stmt->execute()) {
    header('Location: ../index.html?page=settings');
}