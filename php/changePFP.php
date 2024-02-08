<?php

include 'db_conn.php';
session_start();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (isset($_FILES["file"]) && $_FILES["file"]["error"] == 0) {

        $stmtSelect = $conn->prepare('SELECT pfp FROM accounts WHERE id = ?');
        $stmtSelect->bind_param('i', $_SESSION['user_id']);
        $stmtSelect->execute();
        $stmtSelect->bind_result($currentPFP);
        $stmtSelect->fetch();
        $stmtSelect->close();

        $targetDir = "../userPFP/";

        if (!empty($currentPFP) && file_exists($targetDir . $currentPFP) && $currentPFP !== 'default.png') {
             unlink($targetDir . $currentPFP);
        }

        $newFileName = uniqid() . '_' . $_FILES["file"]["name"];

        $targetFilePath = $targetDir . $newFileName;

        $imageFileType = strtolower(pathinfo($targetFilePath, PATHINFO_EXTENSION));
        if (in_array($imageFileType, ["png", "jpg", "jpeg"])) {
            if (move_uploaded_file($_FILES["file"]["tmp_name"], $targetFilePath)) {
                $newImageName = $newFileName;

                $stmt = $conn->prepare('UPDATE accounts SET pfp = ? WHERE id = ?');

                $l = intval($_SESSION['user_id']);
                $stmt->bind_param('si', $newImageName, $l);
                if ($stmt->execute()) {
                    $_SESSION['pfp'] = $newImageName;
                    header('Location: ../index.html?page=settings');
                    exit();
                } else {
                    header('Location: ../index.html?page=settings');
                    exit();
                }
            } else {
                header('Location: ../index.html?page=settings');
                exit();
            }
        } else {
            header('Location: ../index.html?page=settings');
            exit();
        }
    } else {
        header('Location: ../index.html?page=settings');
        exit();
    }
} else {
    header('Location: ../index.html?page=settings');
    exit();
}
