<?php


include 'db_conn.php';
session_start();

$userID = htmlspecialchars($_GET['user_id']);
$offset = htmlspecialchars($_GET['offset']);

// Define the number of results per page
$resultsPerPage = 25;

// Calculate the starting point for the query based on offset
$startFrom = $offset * $resultsPerPage;

// Prepare and execute the query to get the followers' username and pfp
$stmt = $conn->prepare('SELECT a.username, a.pfp, f.following_id
                       FROM follows f
                       JOIN accounts a ON f.following_id = a.id
                       WHERE f.followed_id = ?
                       LIMIT ? OFFSET ?');

$stmt->bind_param('iii', $userID, $resultsPerPage, $startFrom);
$stmt->execute();
$result = $stmt->get_result();

// Fetch the results
$followers = [];
while ($row = $result->fetch_assoc()) {
    $followers[] = [
        'username' => $row['username'],
        'pfp' => $row['pfp'],
        'id'=>$row['following_id']
    ];
}

// Close the statement
$stmt->close();

// Send the data as JSON to JavaScript
echo json_encode($followers);
exit();

