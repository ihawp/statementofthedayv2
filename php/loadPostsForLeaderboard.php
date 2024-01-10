<?php

include 'db_conn.php';

// Set the timezone to Saskatoon (-6 hours from UTC)
$conn->query("SET time_zone = '-06:00'");

// Get the current date in Saskatoon time
$currentDate = new DateTime('now', new DateTimeZone('-06:00'));
$currentDateStr = $currentDate->format('Y-m-d');

// Set the start and end time for the range (midnight to 5pm)
$startTime = $currentDateStr . ' 00:00:00';
$endTime = $currentDateStr . ' 17:00:00';

// Retrieve the top 10 posts with likes count, username, and timestamp in Saskatoon time within the range
$stmtTopPosts = $conn->prepare('SELECT p.post_id, p.super_parent_post_id, p.user_id, p.username, p.content, p.likes, p.comments, a.pfp, CONVERT_TZ(p.time_posted, "UTC", "-06:00") as saskatoon_timestamp 
                               FROM posts p
                               JOIN accounts a ON p.user_id = a.id
                               WHERE p.time_posted BETWEEN ? AND ?
                               ORDER BY p.likes DESC
                               LIMIT 10');

$stmtTopPosts->bind_param('ss', $startTime, $endTime);
$stmtTopPosts->execute();
$result = $stmtTopPosts->get_result();

$topPosts = [];

while ($row = $result->fetch_assoc()) {
    $topPosts[] = [
        'post_id'=>$row['post_id'],
        'user_id'=>$row['user_id'],
        'content'=>$row['content'],
        'username'=>$row['username'],
        'likes'=>$row['likes'],
        'comments'=>$row['comments'],
        'pfp'=>$row['pfp'],
        'super_parent_post_id'=>$row['super_parent_post_id']
    ];
}

// Close the statement
$stmtTopPosts->close();

// Send the top 10 posts data as JSON to JavaScript
echo json_encode($topPosts);
exit();

