<?php

include 'functions.php';

if (checkLogged() && checkRequest('GET')) {
    $profileID = htmlspecialchars($_GET['profile_id']);
    $offset = htmlspecialchars($_GET['offset']);
    $userID = intval($_SESSION['user_id']);
    $filters = null;
    $userInfo = array();
    $posts = array();

    $w = STMT($conn, "SELECT id, username, email, last_login, account_created, follow_count, following_count, pfp, filters, medal_selection FROM accounts WHERE id = ? LIMIT 1", ['i'], [$profileID]);
    if (isset($w['result'][0][0])) {
        $userInfo['id'] = $w['result'][0][0];
        $userInfo['username'] = $w['result'][0][1];
        $userInfo['email'] = $w['result'][0][2];
        $userInfo['follow_count'] = $w['result'][0][5];
        $userInfo['following_count'] = $w['result'][0][6];
        $userInfo['pfp'] = $w['result'][0][7];
        $userInfo['medal_selection'] = json_decode($w['result'][0][9]);
    }

    $w = STMT($conn, 'SELECT post_id, content, username, user_id, likes, comments, CONVERT_TZ(time_posted, "UTC", "-06:00") as saskatoon_timestamp
                 FROM posts
                 WHERE user_id = ?
                 ORDER BY time_posted DESC
                 LIMIT 25 OFFSET ?', ['i','i'], [$profileID, $offset]);
    if (isset($w['result'][0][0])) {
        foreach ($w['result'] as $row) {
            $posts[] = [
                'post_id'=>$row[0],
                'user_id'=>$row[3],
                'content'=>$row[1],
                'username'=>$row[2],
                'likes'=>$row[4],
                'comments'=>$row[5],
                'pfp'=>$userInfo['pfp'],
                'medal_selection'=>$userInfo['medal_selection']
            ];
        }
    }

    $w = STMT($conn, 'SELECT filters FROM accounts WHERE id = ?', ['i'], [$userID]);
    if (isset($w['result'][0][0])) {
        $filters = stripslashes($w['result'][0][0]);

        foreach ($posts as &$post) {
            $badWords = json_decode($filters);
            foreach ($badWords as $badWord) {
                $post['content'] = str_ireplace(htmlspecialchars($badWord), '***', $post['content']);
            }
        }
    }
    echo json_encode(['user_info' => $userInfo, 'posts' => $posts]);
} else {
    sendHome();
}

$conn->close();
exit();

