<?php

// must add loading medals
include 'db_conn.php';
session_start();

// Set the timezone to Saskatoon (-6 hours from UTC)
$conn->query("SET time_zone = '-06:00'");

// Get the current date in Saskatoon time
$currentDate = new DateTime('now', new DateTimeZone('-06:00'));
$currentDateStr = $currentDate->format('Y-m-d');

// Set the start and end time for the current month
$startTime = $currentDate->format('Y-m-01 00:00:00');
$endTime = $currentDate->format('Y-m-t 23:59:59');

// Retrieve all posts from the current month
$stmtTopPosts = $conn->prepare('SELECT p.post_id, p.super_parent_post_id, p.user_id, p.username, p.content, p.likes, p.comments, a.pfp, a.medal_selection, CONVERT_TZ(p.time_posted, "UTC", "-06:00") as saskatoon_timestamp 
                               FROM posts p
                               JOIN accounts a ON p.user_id = a.id
                               WHERE p.time_posted BETWEEN ? AND ?
                                 AND p.parent_post_id = 0
                                 AND p.super_parent_post_id = 0
                               ORDER BY p.likes DESC LIMIT 10');

$stmtTopPosts->bind_param('ss', $startTime, $endTime);
$stmtTopPosts->execute();
$result = $stmtTopPosts->get_result();

$topPosts = [];

while ($row = $result->fetch_assoc()) {
    $medalSelection = json_decode($row['medal_selection']);

    $topPosts[] = [
        'post_id' => $row['post_id'],
        'user_id' => $row['user_id'],
        'content' => $row['content'],
        'username' => $row['username'],
        'likes' => $row['likes'],
        'comments' => $row['comments'],
        'pfp' => $row['pfp'],
        'super_parent_post_id' => $row['super_parent_post_id'],
        'medal_selection' => $medalSelection
    ];
}

// Close the statement
$stmtTopPosts->close();

$stmt = $conn->prepare('SELECT filters FROM accounts WHERE id = ?');
$userID = intval($_SESSION['user_id']);
$stmt->bind_param('i',$userID);
if ($stmt->execute()) {
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $filters = stripslashes($row['filters']);
    foreach ($topPosts as &$post) {
        $badWords = json_decode($filters);
        foreach ($badWords as $badWord) {
            $post['content'] = str_ireplace(htmlspecialchars($badWord), '***', $post['content']);
        }
    }
}

// Send the posts data as JSON to JavaScript
echo json_encode($topPosts);
exit();
