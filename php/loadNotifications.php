<?php


// load notifications
// get all viewed and not_viewed notifications
// for the given user_id


// if loaded and viewed = 0
// set viewed to 1

include 'db_conn.php';
session_start();

$data = array();

$userID = intval($_SESSION['user_id']);
$offset = htmlspecialchars($_GET['offset']);

$stmt = $conn->prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY timestamp DESC LIMIT 25 OFFSET ?');
$stmt->bind_param('ii',$userID, $offset);
if ($stmt->execute()) {
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
        $data[] = [
            'id'=>$row['id'],
            'user_id'=>$row['user_id'],
            'post_id'=>$row['post_id'],
            'username'=>$row['username'],
            'noti_type'=>$row['noti_type'],
            'viewed'=>$row['viewed'],
            'timestamp'=>$row['timestamp']
        ];
    }

    $stmt->close();

    // change notifications where viewed is 0
    // to viewed === 1 because the user has
    // loaded their notifications
    // which means they have opened the
    // notifications page
    for ($i = 0; $i < sizeof($data); $i++) {
        if ($data[$i]['viewed'] === 0) {
            // Assuming $data[$i]['id'] is the id of the row
            $id = $data[$i]['id'];

            // Update the 'viewed' column to 1 for the specific row
            $stmt = $conn->prepare('UPDATE notifications SET viewed = 1 WHERE id = ?');
            $stmt->bind_param('i', $id);

            if ($stmt->execute()) {
                $stmt->close();
            } else {
                // Handle the case where the update fails
                echo json_encode($stmt->error);
                $stmt->close();
                exit();
            }
        }
    }
    echo json_encode($data);
    exit();
}