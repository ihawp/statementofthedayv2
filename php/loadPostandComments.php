<?php

include 'db_conn.php';
session_start();

$offset = $_GET['offset'];
$postID = $_GET['post_id'];

$data = array();

// add LIMIT AND OFFSET

$stmt = $conn->prepare('SELECT * FROM posts WHERE post_id = ? OR parent_post_id = ? LIMIT 25 OFFSET ?');
$stmt->bind_param('iii', $postID, $postID, $offset);
if ($stmt->execute()) {
    $result = $stmt->get_result();
    $i = 0;
    while ($row = $result->fetch_assoc()) {
        $data[$i] = [
            'post_id'=>$row['post_id'],
            'user_id'=>$row['user_id'],
            'content'=>$row['content'],
            'username'=>$row['username']
        ];
        $i++;
    }
    echo json_encode($data);
}

$conn->close();
exit();