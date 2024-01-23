<?php

include 'db_conn.php';
session_start();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Check if the file was uploaded without errors
    if (isset($_FILES["file"]) && $_FILES["file"]["error"] == 0) {
        // Set the path to the folder where you want to save the uploaded image

        $stmtSelect = $conn->prepare('SELECT pfp FROM accounts WHERE id = ?');
        $stmtSelect->bind_param('i', $_SESSION['user_id']);
        $stmtSelect->execute();
        $stmtSelect->bind_result($currentPFP);
        $stmtSelect->fetch();
        $stmtSelect->close();

        $targetDir = "../userPFP/";

        // Delete the current pfp file from the directory
        if (!empty($currentPFP) && file_exists($targetDir . $currentPFP) && $currentPFP !== 'default.png') {
             unlink($targetDir . $currentPFP);
        }

        // Generate a unique name for the uploaded file
        $newFileName = uniqid() . '_' . $_FILES["file"]["name"];

        // Set the complete path for the uploaded file
        $targetFilePath = $targetDir . $newFileName;

        // Check if the file is an image
        $imageFileType = strtolower(pathinfo($targetFilePath, PATHINFO_EXTENSION));
        if (in_array($imageFileType, ["png", "jpg", "jpeg"])) {
            // Move the uploaded file to the specified folder
            if (move_uploaded_file($_FILES["file"]["tmp_name"], $targetFilePath)) {
                // Insert the new image name into the database (assuming you have a database structure for user profiles)
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
