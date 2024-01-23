<?php

include 'db_conn.php';
session_start();

$wow = null;

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['response'=>false]);
    exit();
} else {
    $w = intval($_SESSION['user_id']);
    $stmt = $conn->prepare('SELECT medal_selection FROM accounts WHERE id = ? LIMIT 1');
    $stmt->bind_param('i', $w);
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) {
            $wow = $row['medal_selection'];
        }
    }
    echo json_encode([
        'namee'=>$_SESSION['username'],
        'idd'=>$_SESSION['user_id'],
        'pfpp'=>$_SESSION['pfp'],
        'medal'=>$wow
    ]);
    exit();
}