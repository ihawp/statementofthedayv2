
<?php

include 'db_conn.php';
session_start();

$post = htmlspecialchars($_POST['content']);
$data = array();

if ($post[0] === ' ') {
    header('Location: ../index.html?page=home&error=accidentalclickk');
    exit();
}

if (isset($_SESSION['username']) && isset($_SESSION['user_id'])) {
    if (strlen($post) <= 0) {
        header('Location: ../index.html?page=home&error=accidentalclickwow');
        exit();
    }

    $stmt = $conn->prepare('INSERT INTO posts (content, time_posted, username, user_id) VALUES (?, NOW(6), ?, ?)');
    $stmt->bind_param('ssi', $post, $_SESSION['username'], $_SESSION['user_id']);
    if ($stmt->execute()) {
        $lastInsertedId = $conn->insert_id;
        $stmt->close();

        $stmt = $conn->prepare('SELECT p.post_id, p.super_parent_post_id, p.user_id, p.content, p.username, p.likes, p.comments, a.pfp 
                               FROM posts p
                               LEFT JOIN accounts a ON p.user_id = a.id
                               WHERE p.post_id = ?');
        $stmt->bind_param('i', $lastInsertedId);

        if ($stmt->execute()) {
            $result = $stmt->get_result();
            while ($row = $result->fetch_assoc()) {
                $data = [
                    'post_id'=>$row['post_id'],
                    'user_id'=>$row['user_id'],
                    'content'=>$row['content'],
                    'username'=>$row['username'],
                    'likes'=>$row['likes'],
                    'comments'=>$row['comments'],
                    'pfp'=>$row['pfp'],
                    'super_parent_post_id'=>$row['super_parent_post_id']
                ];
            }
            header('Location: ../index.html?page=home&success=true');
            exit();
        } else {
            header('Location: ../index.html?page=home&error=accidentalclickkkkk');
            exit();
        }
    } else {
        header('Location: ../index.html?page=home&error=accidentalclickkk');
        exit();
    }
} else {
    header('Location: ../index.html?page=home&error=accidentalclickk');
    exit();
}