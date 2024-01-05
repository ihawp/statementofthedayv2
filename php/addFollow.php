<?php

$userID = $_SESSION['user_id'];
$toBeFollowedID = $_GET['followed_id'];

// not logged in case
if ($userID === null) {
    header('Location: ../index.html?skidattle');
    exit();
}

