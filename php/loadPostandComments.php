<?php

include 'db_conn.php';
session_start();

$offset = $_GET['offset'];
$postID = $_GET['post_id'];

$data = array();

$stmt = $conn->prepare('SELECT p.post_id, p.super_parent_post_id, p.user_id, p.content, p.username, p.likes, p.comments, a.pfp 
                       FROM posts p
                       LEFT JOIN accounts a ON p.user_id = a.id
                       WHERE p.post_id = ? OR p.parent_post_id = ? 
                       LIMIT 25 OFFSET ?');
$stmt->bind_param('iii', $postID, $postID, $offset);
if ($stmt->execute()) {
    $result = $stmt->get_result();
    $i = 0;
    while ($row = $result->fetch_assoc()) {
        $data[$i] = [
            'post_id'=>$row['post_id'],
            'user_id'=>$row['user_id'],
            'content'=>$row['content'],
            'username'=>$row['username'],
            'likes'=>$row['likes'],
            'comments'=>$row['comments'],
            'pfp'=>$row['pfp'],
            'super_parent_post_id'=>$row['super_parent_post_id']
        ];
        $i++;
    }
    echo json_encode($data);
}

$conn->close();
exit();
