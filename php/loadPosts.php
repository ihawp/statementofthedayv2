<?php

include 'functions.php';

if (checkLogged() && checkRequest('GET')) {
    $offset = htmlspecialchars($_GET['offset']);
    $limit = htmlspecialchars($_GET['limit']);
    $data = array();
    $w = STMT($conn, 'SELECT p.post_id, p.super_parent_post_id, p.user_id, p.content, p.username, p.likes, p.comments, a.pfp, a.medal_selection
                       FROM posts p
                       LEFT JOIN accounts a ON p.user_id = a.id
                       WHERE p.parent_post_id = 0 
                       ORDER BY p.time_posted DESC 
                       LIMIT ? OFFSET ?', ['i','i'], [$limit, $offset]);
    if (isset($w['result'][0])) {
        foreach ($w['result'] as $row) {
            $medalSelection = json_decode($row[8]);
            $data[] = [
                'post_id'=>$row[0],
                'user_id'=>$row[2],
                'content'=>$row[3],
                'username'=>$row[4],
                'likes'=>$row[5],
                'comments'=>$row[6],
                'pfp'=>$row[7],
                'super_parent_post_id'=>$row[1],
                'medal_selection'=>$medalSelection
            ];
        }
        $userID = intval($_SESSION['user_id']);
        $filters = null;
        $w = STMT($conn, 'SELECT filters FROM accounts WHERE id = ?', ['i'], [$userID]);
        if ($w['result'][0]) {
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
