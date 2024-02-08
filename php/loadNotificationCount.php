<?php


// get the notification count for all notifications not viewed by the user

// display it on the dom

// if notification tab is opened red alert is removed
// notifications are set to viewed in database


// will make automatic script that will clear
// notifications that have been viewed
// and are at least 30 days old
// script will run once a day


include 'db_conn.php';
session_start();

$userID = $_SESSION['user_id'];
// select all notifications
// LIMIT 100
// if list is longer than 99 it displays 99+ in DOM
$data = array();
$stmt = $conn->prepare('SELECT viewed, timestamp FROM notifications WHERE user_id = ? AND viewed = 0 LIMIT 100');
$stmt->bind_param('i', $userID);
if ($stmt->execute()) {
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
        $data[] = [
            'viewed'=>$row['viewed']
        ];
    }
    $lengthOfArray = sizeof($data);
    $stmt->close();
    echo json_encode(['count'=>$lengthOfArray]);
    exit();
}

$stmt->close();
$conn->close();
exit();