<?php
include 'db_conn.php';
session_start();
$medalId = htmlspecialchars($_POST['medal_id']);
$accountId = $_SESSION['user_id'];

$stmtMedal = $conn->prepare("SELECT * FROM medals WHERE id = ?");
$stmtMedal->bind_param('i', $medalId);

if ($stmtMedal->execute()) {
    $resultMedal = $stmtMedal->get_result();
    if ($resultMedal->num_rows > 0) {
        $medalInfo = $resultMedal->fetch_row();

        $wow =json_encode($medalInfo);

        $stmtUpdate = $conn->prepare("UPDATE accounts SET medal_selection = ? WHERE id = ?");
        $stmtUpdate->bind_param('si', $wow, $accountId);

        if ($stmtUpdate->execute()) {
            echo json_encode(['stmt' => true]);
            exit();
        } else {
            echo json_encode(['stmt'=>false]);
            exit();

        }
        $stmtUpdate->close();
    } else {
        echo json_encode(['stmt'=>false]);
        exit();

    }
} else {
    echo json_encode(['stmt'=>false]);
    exit();

}

$stmtMedal->close();
$conn->close();

