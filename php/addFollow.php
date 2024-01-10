<?php

include 'db_conn.php';
session_start();


$userID = $_SESSION['user_id'];
$uploadUserID = $_GET['following'];
$toBeFollowedID = $_GET['followed'];

// not logged in case
if ($userID === null) {
    header('Location: ../index.html?skidattle');
    exit();
}

// check if they already follow the user
// if so remove the follow

// if they dont already follow them add the follow
// to the db!

if ($uploadUserID == intval($_SESSION['user_id'])) {
    $stmt = $conn->prepare('SELECT * FROM follows WHERE followed_id = ? AND following_id = ?');
    $stmt->bind_param('ii',$toBeFollowedID, $uploadUserID);
    if ($stmt->execute()) {
        $stmt->store_result();
        $rowCount = $stmt->num_rows;
        $stmt->close();
        if ($rowCount === 0) {
            $stmt = $conn->prepare('INSERT INTO follows (followed_id, following_id, timestamp) VALUES (?, ?, NOW(6))');
            $stmt->bind_param('ii', $toBeFollowedID, $uploadUserID);
            if ($stmt->execute()) {
                $following_count_stmt = $conn->prepare('UPDATE accounts SET following_count = following_count + 1 WHERE id = ?');
                $following_count_stmt->bind_param('i', $uploadUserID);

                $follow_count_stmt = $conn->prepare('UPDATE accounts SET follow_count = follow_count + 1 WHERE id = ?');
                $follow_count_stmt->bind_param('i', $toBeFollowedID);

                if ($following_count_stmt->execute() && $follow_count_stmt->execute()) {
                    echo json_encode(['following' => true]);
                } else {
                    echo json_encode(['following' => false]);
                }
            }
        } else {
            $stmt = $conn->prepare('DELETE FROM follows WHERE followed_id = ? AND following_id = ?');
            $stmt->bind_param('ii', $toBeFollowedID, $uploadUserID);
            if ($stmt->execute()) {

                $following_count_stmt = $conn->prepare('UPDATE accounts SET following_count = following_count - 1 WHERE id = ?');
                $following_count_stmt->bind_param('i', $uploadUserID);

                $follow_count_stmt = $conn->prepare('UPDATE accounts SET follow_count = follow_count - 1 WHERE id = ?');
                $follow_count_stmt->bind_param('i', $toBeFollowedID);

                if ($following_count_stmt->execute() && $follow_count_stmt->execute()) {
                    echo json_encode(['unfollowed' => true]);
                } else {
                    echo json_encode(['unfollowed' => false]);
                }
            }
        }
    }
}

$conn->close();
exit();
