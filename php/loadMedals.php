<?php

// load * from medals table
// load based on the $_SESSION['user_id']

// send back all info for each medal

include 'db_conn.php';
session_start();

$userID = intval($_SESSION['user_id']);

$wow = Array();

$stmt = $conn->prepare('SELECT * FROM medals WHERE user_id = ?');
$stmt->bind_param('i', $userID);
if ($stmt->execute()) {
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
        $wow[] = [
            'id'=>$row['id'],
            'post_id'=>$row['post_id'],
            'user_id'=>$row['user_id'],
            'placement'=>$row['placement'],
            'timestamp'=>$row['timestamp']
        ];
    }
}
echo json_encode($wow);