<?php

include 'db_conn.php';
session_start();


$userID = intval(htmlspecialchars($_SESSION['user_id']));
$uploadUserID = intval(htmlspecialchars($_GET['following']));
$toBeFollowedID = intval(htmlspecialchars($_GET['followed']));
$postID = $toBeFollowedID;
$typeParam = 'follow';

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

                    $follow_count_stmt->close();
                    $following_count_stmt->close();

                    // will need to person following username

                    $stmt = $conn->prepare('SELECT username FROM accounts WHERE id = ? LIMIT 1');
                    $stmt->bind_param('i', $userID);
                    if ($stmt->execute()) {
                        $result = $stmt->get_result();
                        $row = $result->fetch_assoc();
                        $followingUsername = $row['username'];
                    }
                    $stmt->close();

                    $stmt = $conn->prepare('INSERT INTO notifications (username, user_id, post_id, noti_type, timestamp) VALUES (?, ?, ?,?, NOW(6))');
                    $stmt->bind_param('siis',$followingUsername, $toBeFollowedID, $userID, $typeParam);
                    if ($stmt->execute()) {
                        $stmt->close();
                        echo json_encode(['following' => true]);
                        exit();
                    }
                    // and user_id of user being followed
                    // along with timestamp

                } else {
                    echo json_encode(['following' => false]);
                    exit();
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


                    // get username
                    $stmt = $conn->prepare('SELECT username FROM accounts WHERE id = ? LIMIT 1');
                    $stmt->bind_param('i', $userID);
                    if ($stmt->execute()) {
                        $result = $stmt->get_result();
                        $row = $result->fetch_assoc();
                        $followingUsername = $row['username'];
                    }
                    $stmt->close();

                    $stmt = $conn->prepare('DELETE FROM notifications WHERE user_id = ? AND noti_type = ? AND username = ?');
                    $stmt->bind_param('iss',$toBeFollowedID, $typeParam, $followingUsername);
                    if ($stmt->execute()) {
                        echo json_encode(['unfollowed' => true]);
                    }
                } else {
                    echo json_encode(['unfollowed' => false]);
                }
            }
        }
    }
}

$conn->close();
exit();
