<?php

// must add loading medals

include 'db_conn.php';
session_start();

$user = intval($_SESSION['user_id']);
$wow = array();

// Get followers list
$stmt = $conn->prepare('SELECT followed_id FROM follows WHERE following_id = ?');
$stmt->bind_param('i', $user);
if ($stmt->execute()) {
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
        $wow[] = $row['followed_id'];
    }
    $stmt->close();

    // get list of posts from lists following list
    $offset = intval($_GET['offset']);
    $limit = intval($_GET['limit']);
    $data = array();
    $sql = "SELECT p.post_id, p.super_parent_post_id, p.user_id, p.content, p.username, p.likes, p.comments, a.pfp, a.medal_selection 
        FROM posts p
        LEFT JOIN accounts a ON p.user_id = a.id
        WHERE p.parent_post_id = 0 
          AND p.user_id IN (" . implode(',', array_fill(0, count($wow), '?')) . ")
        ORDER BY p.time_posted DESC 
        LIMIT ? OFFSET ?";

    $stmt = $conn->prepare($sql);

    $paramTypes = str_repeat('i', count($wow)) . 'ii';
    $bindParams = [$paramTypes];

    foreach ($wow as &$value) {
        $bindParams[] = &$value;
    }
    $bindParams[] = &$limit;
    $bindParams[] = &$offset;

    // Call bind_param dynamically
    call_user_func_array([$stmt, 'bind_param'], $bindParams);
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
        // Iterate through each post and replace bad words
        foreach ($data as &$post) {
            $badWords = json_decode($filters);
            foreach ($badWords as $badWord) {
                $post['content'] = str_ireplace(htmlspecialchars($badWord), '***', $post['content']);
            }
        }
        echo json_encode($data);
    } else {
        echo "Error executing statement";
    }
    $stmt->close();
}
