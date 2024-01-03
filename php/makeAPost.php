<?php


include 'db_conn.php';
session_start();

$post = htmlspecialchars($_POST['makeAPost']);

if (isset($_SESSION['username']) && isset($_SESSION['user_id'])) {
    if ($post.ob_get_length() <= 0) {
        header('Location: ../index.html?page=home&error=accidentalclick');
        exit();
    }

    // upload to db and return user to home page

    $stmt = $conn->prepare('INSERT INTO posts (content, time_posted) VALUES (?, NOW(6))');
    $stmt->bind_param('s', $post);
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