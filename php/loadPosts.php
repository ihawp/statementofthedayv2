<?php

include 'db_conn.php';
session_start();

$offset = htmlspecialchars($_GET['offset']);
$limit = htmlspecialchars($_GET['limit']);

$data = array();

$stmt = $conn->prepare("SELECT p.post_id, p.super_parent_post_id, p.user_id, p.content, p.username, p.likes, p.comments, a.pfp, a.medal_selection
                       FROM posts p
                       LEFT JOIN accounts a ON p.user_id = a.id
                       WHERE p.parent_post_id = 0 
                       ORDER BY p.time_posted DESC 
                       LIMIT ? OFFSET ?");
$stmt->bind_param('ii', $limit, $offset);
if ($stmt->execute()) {
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
        $medalSelection = json_decode($row['medal_selection']);

        $data[] = [
            'post_id'=>$row['post_id'],
            'user_id'=>$row['user_id'],
            'content'=>$row['content'],
            'username'=>$row['username'],
            'likes'=>$row['likes'],
            'comments'=>$row['comments'],
            'pfp'=>$row['pfp'],
            'super_parent_post_id'=>$row['super_parent_post_id'],
            'medal_selection'=>$medalSelection
        ];
    }
    $stmt->close();

    $stmt = $conn->prepare('SELECT filters FROM accounts WHERE id = ?');
    $userID = intval($_SESSION['user_id']);
    $stmt->bind_param('i',$userID);
    $filters = null;
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $filters = stripslashes($row['filters']);
    }
    foreach ($data as &$post) {
        $badWords = json_decode($filters);
        foreach ($badWords as $badWord) {
            $post['content'] = str_ireplace(htmlspecialchars($badWord), '***', $post['content']);
        }
    }
    echo json_encode($data);
}

$conn->close();
exit();
