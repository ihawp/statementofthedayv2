<?php

include 'db_conn.php';
session_start();

$postID = htmlspecialchars($_GET['post_id']);
$userID = $_SESSION['user_id'];
$likeSTR = 'like';

// Check if the user has already liked the post
$stmtCheckLiked = $conn->prepare('SELECT 1 FROM likes WHERE post_id = ? AND user_id = ? LIMIT 1');
$stmtCheckLiked->bind_param('ii', $postID, $userID);

if ($stmtCheckLiked->execute()) {
    if ($stmtCheckLiked->fetch()) {
        $stmtCheckLiked->close();


        // Remove the like from the likes table
        $stmtRemoveLike = $conn->prepare('DELETE FROM likes WHERE post_id = ? AND user_id = ?');
        $stmtRemoveLike->bind_param('ii', $postID, $userID);

        if ($stmtRemoveLike->execute()) {
            // Decrement the likes count in the posts table
            $stmtDecrementLikeCount = $conn->prepare('UPDATE posts SET likes = likes - 1 WHERE post_id = ?');
            $stmtDecrementLikeCount->bind_param('i', $postID);
            $stmtDecrementLikeCount->execute();

            // Close the decrement like count statement
            $stmtDecrementLikeCount->close();

            $stmt = $conn->prepare('SELECT user_id FROM posts WHERE post_id = ?');
            $stmt->bind_param('i', $postID);
            if ($stmt->execute()) {
                $result = $stmt->get_result();
                while ($row = $result->fetch_assoc()) {
                    $userID2 = $row['user_id'];
                }
                $stmt->close();
                if (intval($_SESSION['user_id']!==$userID2)) {
                    $stmt = $conn->prepare('DELETE FROM notifications WHERE username = ? AND post_id = ? AND noti_type = ?');
                    $stmt->bind_param('sis',$_SESSION['username'], $postID, $likeSTR);
                    if ($stmt->execute()) {
                        echo json_encode(['removed_like' => true]);
                        exit();
                    }
                }
            } else {
                echo json_encode(['stmt'=>false]);
                exit();
            }
        } else {
            echo json_encode(['stmt' => false]);
            exit();
        }

        // Close the remove like statement
        $stmtRemoveLike->close();
        echo json_encode(['removed_like' => true]);

        exit();
    }
} else {
    $stmtCheckLiked->close();
}

$stmtInsertLike = $conn->prepare('INSERT INTO likes (user_id, post_id, timestamp) VALUES (?, ?, NOW(6))');
$stmtInsertLike->bind_param('ii', $userID, $postID);

if ($stmtInsertLike->execute()) {
    // Increment the likes count in the posts table
    $stmtIncrementLikeCount = $conn->prepare('UPDATE posts SET likes = likes + 1 WHERE post_id = ?');
    $stmtIncrementLikeCount->bind_param('i', $postID);
    $stmtIncrementLikeCount->execute();

    // Close the increment like count statement
    $stmtIncrementLikeCount->close();

    $stmt = $conn->prepare('SELECT user_id FROM posts WHERE post_id = ?');
    $stmt->bind_param('i',$postID);
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) {
            $userID2 = $row['user_id'];
        }
        $stmt->close();
        if (intval($_SESSION['user_id']!==$userID2)) {
            $stmt = $conn->prepare('INSERT INTO notifications (username, user_id, post_id, noti_type, timestamp) VALUES (?, ?, ?,?, NOW(6))');
            $likeSTR = 'like';
            $stmt->bind_param('siis',$_SESSION['username'], $userID2, $postID, $likeSTR);
            if ($stmt->execute()) {
                $stmt->close();
                echo json_encode(['like_added' => true]);
            }
        } else {
            echo json_encode(['like_added' => true]);
        }
    }
} else {
    echo json_encode(['stmt' => false]);
}

$stmtCheckLiked->close();
$stmtInsertLike->close();

$conn->close();
exit();