<?php

// ihawp

// THIS SCRIPT CURRENTLY JUST LOADS
// RANDOM POSTS

// I will make other scripts for other 'types' of posts
// (based on user settings, following, leaderboard)

include 'db_conn.php';
session_start();

$offset = htmlspecialchars($_GET['offset']);
$limit = htmlspecialchars($_GET['limit']);

$data = array();

$stmt = $conn->prepare("SELECT post_id, user_id, content, username FROM posts ORDER BY time_posted DESC LIMIT ? OFFSET ?");
$stmt->bind_param('ii', $limit, $offset);
if ($stmt->execute()) {
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
        $data[] = [
            'post_id'=>$row['post_id'],
            'user_id'=>$row['user_id'],
            'content'=>$row['content'],
            'username'=>$row['username']
        ];
    }
    echo json_encode($data);
}

// use the user ids to load usernames from accounts table
