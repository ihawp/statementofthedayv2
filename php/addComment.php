<?php

include 'db_conn.php';
session_start();

$parentID = htmlspecialchars($_POST['post_id']);
$usernamee = htmlspecialchars($_SESSION['username']);
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
    $stmtInsertComment->close();
    $stmtUpdateCommentCount->execute();
    $stmtUpdateCommentCount->close();


    // use post ID to get username for noti
    $stmt=$conn->prepare('SELECT user_id FROM posts WHERE post_id = ?');
    $stmt->bind_param('i',$parentID);
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $userIDD = $row['user_id'];

        // use username for notification statemetn

        $stmt->close();

        $stmt = $conn->prepare('SELECT post_id FROM posts WHERE user_id = ? ORDER BY time_posted DESC LIMIT 1');
        $stmt->bind_param('i', $userID);
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();
            $properID = $row['post_id'];
            $stmt->close();

            if ($userIDD !== $_SESSION['user_id']) {
                $stmt=$conn->prepare('INSERT INTO notifications (user_id, post_id, username, noti_type, timestamp) VALUES (?,?,?,?,NOW(6))');
                $type = 'comment';
                $stmt->bind_param('iiss', $userIDD, $properID, $usernamee, $type);
                if ($stmt->execute()) {
                    header('Location: ../index.html?page=home&post_id=' . $parentID.'&viewing_post=true');
                    exit();
                }
            } else {
                header('Location: ../index.html?page=home&post_id=' . $parentID.'&viewing_post=true');
                exit();
            }
        }
    }
} else {
    header('Location: ../index.html?page=home');
    exit();
}

