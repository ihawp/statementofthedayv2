<?php

include 'functions.php';

if (checkLogged() && checkRequest('GET')) {
    $conn->query("SET time_zone = '-06:00'");
    $currentDate = new DateTime('now', new DateTimeZone('-06:00'));
    $currentDateStr = $currentDate->format('Y-m-d');
    $startTime = $currentDateStr . ' 00:00:00';
    $endTime = $currentDateStr . ' 17:00:00';
    $userID = intval($_SESSION['user_id']);
    $topPosts = [];
    $w = STMT($conn, 'SELECT p.post_id, p.super_parent_post_id, p.user_id, p.username, p.content, p.likes, p.comments, a.pfp, a.medal_selection, CONVERT_TZ(p.time_posted, "UTC", "-06:00") as saskatoon_timestamp 
                               FROM posts p
                               JOIN accounts a ON p.user_id = a.id
                               WHERE p.time_posted BETWEEN ? AND ?
                                 AND p.parent_post_id = 0
                                 AND p.super_parent_post_id = 0
                               ORDER BY p.likes DESC
                               LIMIT 10', ['s','s'], [$startTime, $endTime]);
    if (isset($w['result'][0][0])) {
        foreach ($w['result'] as $row) {
            $medalSelection = json_decode($row[8]);
            $topPosts[] = [
                'post_id'=>$row[0],
                'user_id'=>$row[2],
                'content'=>$row[4],
                'username'=>$row[3],
                'likes'=>$row[5],
                'comments'=>$row[6],
                'pfp'=>$row[7],
                'super_parent_post_id'=>$row[1],
                'medal_selection'=>$medalSelection
            ];
        }
        $w = STMT($conn, 'SELECT filters FROM accounts WHERE id = ?', ['i'], [$userID]);
        if (isset($w['result'][0][0])) {
            $filters = stripslashes($w['result'][0][0]);
            foreach ($topPosts as &$post) {
                $badWords = json_decode($filters);
                foreach ($badWords as $badWord) {
                    $post['content'] = str_ireplace(htmlspecialchars($badWord), '***', $post['content']);
                }
            }
        }
    }
    echo json_encode($topPosts);
} else {
    sendHome();
}

$conn->close();
exit();
