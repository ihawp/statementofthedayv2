<?php


include 'db_conn.php';
session_start();

$post = htmlspecialchars($_POST['makeAPost']);

if (isset($_SESSION['username']) && isset($_SESSION['user_id'])) {
    if ($post.ob_get_length() <= 0) {
        header('Location: ../index.html?page=home&error=accidentalclick');
        exit();
    }

    $stmt = $conn->prepare('INSERT INTO posts (content, time_posted, username, user_id) VALUES (?, NOW(6), ?, ?)');
    $stmt->bind_param('ssi', $post, $_SESSION['username'], $_SESSION['user_id']);
    if ($stmt->execute()) {
        header('Location: ../index.html?page=home&post=success');
        exit();
    } else {
        header('Location: ../index.html?page=home&error=dberror');
        exit();
    }
} else {
    header('Location: ../index.html?page=home&error=howdidyougetthere');
    exit();
}