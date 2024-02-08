<?php

// must add loading medals

include 'db_conn.php';
session_start();

function loadProfileData($conn, $profileID, $offset) {
    $stmtUserInfo = $conn->prepare('SELECT id, username, email, last_login, account_created, follow_count, following_count, pfp, filters, medal_selection FROM accounts WHERE id = ? LIMIT 1');
    $stmtUserInfo->bind_param('i', $profileID);

    if (!$stmtUserInfo->execute()) {
        // Log the error
        error_log('Error executing user information query: ' . $stmtUserInfo->error);
        return null;
    }

    $resultUserInfo = $stmtUserInfo->get_result();

    $userInfo = $resultUserInfo->fetch_assoc();

    $stmtUserInfo->close();

    if ($userInfo === null) {
        error_log('User information not found for user ID: ' . $profileID);
    }

    $userInfo['medal_selection'] = json_decode($userInfo['medal_selection']);

    $sqlPosts = 'SELECT post_id, content, username, user_id, likes, comments, CONVERT_TZ(time_posted, "UTC", "-06:00") as saskatoon_timestamp
                 FROM posts
                 WHERE user_id = ?
                 ORDER BY time_posted DESC
                 LIMIT 25 OFFSET ?;';

    $stmtPosts = $conn->prepare($sqlPosts);
    $stmtPosts->bind_param('ii', $profileID, $offset);

    if (!$stmtPosts->execute()) {
        error_log('Error executing posts query: ' . $stmtPosts->error);
        return null;
    }

    $resultPosts = $stmtPosts->get_result();

    $posts = [];
    while ($row = $resultPosts->fetch_assoc()) {
        $posts[] = [
            'post_id'=>$row['post_id'],
            'user_id'=>$row['user_id'],
            'content'=>$row['content'],
            'username'=>$row['username'],
            'likes'=>$row['likes'],
            'comments'=>$row['comments'],
            'pfp'=>$userInfo['pfp'],
            'medal_selection'=>$userInfo['medal_selection']
        ];
    }

    $stmtPosts->close();

    $stmt = $conn->prepare('SELECT filters FROM accounts WHERE id = ?');
    $userID = intval($_SESSION['user_id']);
    $stmt->bind_param('i',$userID);
    $filters = null;
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $filters = stripslashes($row['filters']);
    }
    foreach ($posts as &$post) {
        $badWords = json_decode($filters);
        foreach ($badWords as $badWord) {
            $post['content'] = str_ireplace(htmlspecialchars($badWord), '***', $post['content']);
        }
    }

    return ['user_info' => $userInfo, 'posts' => $posts];
}

if (isset($_GET['profile_id']) && isset($_GET['offset'])) {
    $profileID = $_GET['profile_id'];
    $offset = $_GET['offset'];

    $profileData = loadProfileData($conn, $profileID, $offset);

    echo json_encode($profileData);
} else {
    echo json_encode(['error' => 'Invalid request']);
}

$conn->close();
exit();

