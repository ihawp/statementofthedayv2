<?php

include 'db_conn.php';
session_start();

$postID = htmlspecialchars($_GET['post_id']);
$userID = $_SESSION['user_id'];

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
            echo json_encode(['removed_like' => true]);

            // Decrement the likes count in the posts table
            $stmtDecrementLikeCount = $conn->prepare('UPDATE posts SET likes = likes - 1 WHERE post_id = ?');
            $stmtDecrementLikeCount->bind_param('i', $postID);
            $stmtDecrementLikeCount->execute();

            // Close the decrement like count statement
            $stmtDecrementLikeCount->close();

        } else {
            echo json_encode(['stmt' => false]);
        }

        // Close the remove like statement
        $stmtRemoveLike->close();

        exit();
    }
} else {
    echo json_encode(['stmt' => false]);
    $stmtCheckLiked->close();
    $conn->close();
    exit();
}

$stmtInsertLike = $conn->prepare('INSERT INTO likes (user_id, post_id, timestamp) VALUES (?, ?, NOW(6))');
$stmtInsertLike->bind_param('ii', $userID, $postID);

if ($stmtInsertLike->execute()) {
    echo json_encode(['like_added' => true]);

    // Increment the likes count in the posts table
    $stmtIncrementLikeCount = $conn->prepare('UPDATE posts SET likes = likes + 1 WHERE post_id = ?');
    $stmtIncrementLikeCount->bind_param('i', $postID);
    $stmtIncrementLikeCount->execute();

    // Close the increment like count statement
    $stmtIncrementLikeCount->close();

} else {
    echo json_encode(['stmt' => false]);
}

$stmtCheckLiked->close();
$stmtInsertLike->close();

$conn->close();
exit();