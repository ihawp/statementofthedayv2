<?php

include 'db_conn.php';
session_start();

$userID = htmlspecialchars($_GET['user_id']);
$offset = htmlspecialchars($_GET['offset']);

$resultsPerPage = 25;

$startFrom = $offset * $resultsPerPage;

$stmt = $conn->prepare('SELECT a.username, a.pfp, f.followed_id
                       FROM follows f
                       JOIN accounts a ON f.followed_id = a.id
                       WHERE f.following_id = ?
                       LIMIT ? OFFSET ?');

$stmt->bind_param('iii', $userID, $resultsPerPage, $startFrom);
$stmt->execute();
$result = $stmt->get_result();

$followedUsers = [];
while ($row = $result->fetch_assoc()) {
    $followedUsers[] = [
        'username' => $row['username'],
        'pfp' => $row['pfp'],
        'id' => $row['followed_id']
    ];
}

$stmt->close();

echo json_encode($followedUsers);
exit();
