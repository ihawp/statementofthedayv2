<?php

include 'functions.php';

if (checkLogged() && checkRequest('GET')) {
    $offset = htmlspecialchars($_GET['offset']);
    $postID = htmlspecialchars($_GET['post_id']);
    $data = array();
    $w = STMT($conn, 'SELECT p.post_id, p.super_parent_post_id, p.user_id, p.content, p.username, p.likes, p.comments, a.pfp, a.medal_selection
                       FROM posts p
                       LEFT JOIN accounts a ON p.user_id = a.id
                       WHERE p.post_id = ? OR p.parent_post_id = ? 
                       LIMIT 25 OFFSET ?', ['i','i','i'], [$postID, $postID, $offset]);
    if (isset($w['result'][0])) {
        foreach ($w['result'] as $row) {
            $medalSelection = json_decode($row[8]);
            $data[] = [
                'post_id'=>$row[0],
                'super_parent_post_id'=>$row[1],
                'user_id'=>$row[2],
                'content'=>$row[3],
                'username'=>$row[4],
                'likes'=>$row[5],
                'comments'=>$row[6],
                'pfp'=>$row[7],
                'medal_selection'=>$medalSelection
            ];
        }
        $userID = intval($_SESSION['user_id']);
        $w = STMT($conn, 'SELECT filters FROM accounts WHERE id = ?', ['i'], [$userID]);
        if (isset($w['result'][0])) {
            $filters = stripslashes($w['result'][0][0]);
            foreach ($data as &$post) {
                $badWords = json_decode($filters);
                foreach ($badWords as $badWord) {
                    $post['content'] = str_ireplace(htmlspecialchars($badWord), '***', $post['content']);
                }
            }
        }
    }
    echo json_encode($data);
} else {
    sendHome();
}

$conn->close();
exit();
