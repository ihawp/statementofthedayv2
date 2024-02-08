<?php


include 'db_conn.php';
session_start();

$userID = htmlspecialchars($_GET['user_id']);
$offset = htmlspecialchars($_GET['offset']);

$resultsPerPage = 25;
$startFrom = $offset * $resultsPerPage;
$stmt = $conn->prepare('SELECT a.username, a.pfp, f.following_id
                       FROM follows f
                       JOIN accounts a ON f.following_id = a.id
                       WHERE f.followed_id = ?
                       LIMIT ? OFFSET ?');

$stmt->bind_param('iii', $userID, $resultsPerPage, $startFrom);
$stmt->execute();
$result = $stmt->get_result();

$followers = [];
while ($row = $result->fetch_assoc()) {
    $followers[] = [
        'username' => $row['username'],
        'pfp' => $row['pfp'],
        'id'=>$row['following_id']
    ];
}
$stmt->close();
echo json_encode($followers);
exit();

