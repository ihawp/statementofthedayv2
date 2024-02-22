<?php

include 'functions.php';

$post = htmlspecialchars($_POST['content']);
$data = array();


if (checkLogged() && checkRequest('POST')) {
    if (strlen(trim($post)) <= 0) {
        header('Location: ../index.html?page=home&error=accidentalclickwow');
        exit();
    }

    if (isset($_SESSION['username']) && isset($_SESSION['user_id'])) {
        $w = STMT($conn, 'INSERT INTO posts (content, time_posted, username, user_id) VALUES (?, NOW(6), ?, ?)', ['s', 's', 'i'], [$post, $_SESSION['username'], $_SESSION['user_id']]);
        if ($w['result']) {
            header('Location: ../index.html?page=home&success=true');
        } else {
            header('Location: ../index.html?page=home&error=accidentalclickkkkk');
        }
    } else {
        header('Location: ../index.html?page=home&error=accidentalclickk');
    }
} else {
    sendHome();
}

$conn->close();
exit();