<?php

include 'db_conn.php';
session_start();

$parentID = htmlspecialchars($_POST['post_id']);
$userID = htmlspecialchars($_SESSION['user_id']);
$commentContent = htmlspecialchars($_POST['commentContent']);

if ($commentContent.ob_get_length() <= 0) {
    header("Location: ../index.html?page=home&viewing_post=true&post_id=$parentID&error=accidentalclick");
    exit();
}

// Check if a row with post_id = parentID exists
$stmtCheckSuperParent = $conn->prepare('SELECT super_parent_post_id FROM posts WHERE post_id = ? LIMIT 1');
$stmtCheckSuperParent->bind_param('i', $parentID);
$stmtCheckSuperParent->execute();
$resultCheckSuperParent = $stmtCheckSuperParent->get_result();
$rowCheckSuperParent = $resultCheckSuperParent->fetch_assoc();

if ($rowCheckSuperParent && $rowCheckSuperParent['super_parent_post_id'] === 0) {
    $superParentID = $parentID;
} elseif ($rowCheckSuperParent && $rowCheckSuperParent['super_parent_post_id'] !== 0) {
    $superParentID = $rowCheckSuperParent['super_parent_post_id'];
}

// Insert the new comment
$stmtInsertComment = $conn->prepare('INSERT INTO posts (parent_post_id, super_parent_post_id, user_id, username, content, time_posted) VALUES (?, ?, ?, ?, ?, NOW(6))');
$stmtInsertComment->bind_param('iiiss', $parentID, $superParentID, $userID, $_SESSION['username'], $commentContent);

// Update the comment count in the posts table
$stmtUpdateCommentCount = $conn->prepare('UPDATE posts SET comments = comments + 1 WHERE post_id = ?');
$stmtUpdateCommentCount->bind_param('i', $parentID);

if ($stmtInsertComment->execute()) {
    // Increment the comment count
    $stmtUpdateCommentCount->execute();

    // Redirect to the post page
    header('Location: ../index.html?page=home&post_id=' . $parentID.'&viewing_post=true');
    exit();
} else {
    header('Location: ../index.html?page=home');
    exit();
}

