<?php

// check their following list
// by making a query to follows
// store ids in an array
// loop through array to find 25 MOST RECENT posts
// ^ take one from everyone possible
// before looping through the list again?


// will need to send a value back
// to be stored in offset var for load more purposes


include 'db_conn.php';
session_start();

$offset = htmlspecialchars($_GET['offset']);
$limit = htmlspecialchars($_GET['limit']);

$data = array();

$stmt = $conn->prepare("SELECT p.post_id, p.super_parent_post_id, p.user_id, p.content, p.username, p.likes, p.comments, a.pfp 
                       FROM posts p
                       LEFT JOIN accounts a ON p.user_id = a.id
                       WHERE p.parent_post_id = 0 
                       ORDER BY p.time_posted DESC 
                       LIMIT ? OFFSET ?");
$stmt->bind_param('ii', $limit, $offset);
if ($stmt->execute()) {
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
        $data[] = [
            'post_id' => $row['post_id'],
            'user_id' => $row['user_id'],
            'content' => $row['content'],
            'username' => $row['username'],
            'likes' => $row['likes'],
            'comments' => $row['comments'],
            'pfp' => $row['pfp'],
            'super_parent_post_id' => $row['super_parent_post_id']
        ];
    }
    echo json_encode($data);
}