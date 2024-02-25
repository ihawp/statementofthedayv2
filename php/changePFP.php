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
            $imageSize = getimagesize($_FILES["file"]["tmp_name"]);
            $imageWidth = $imageSize[0];
            $imageHeight = $imageSize[1];

            $maxWidth = 50;
            $maxHeight = 50;

            if ($imageWidth > $maxWidth || $imageHeight > $maxHeight) {
                $newWidth = ($imageWidth > $maxWidth) ? $maxWidth : $imageWidth;
                $newHeight = ($imageHeight > $maxHeight) ? $maxHeight : $imageHeight;

                switch ($imageFileType) {
                    case "jpg":
                    case "jpeg":
                        $imageResource = imagecreatefromjpeg($_FILES["file"]["tmp_name"]);
                        break;
                    case "png":
                        $imageResource = imagecreatefrompng($_FILES["file"]["tmp_name"]);
                        break;
                    default:
                        header('Location: ../index.html?page=settings');
                        exit();
                }

                $newImageResource = imagecreatetruecolor($newWidth, $newHeight);
                imagecopyresampled($newImageResource, $imageResource, 0, 0, 0, 0, $newWidth, $newHeight, $imageWidth, $imageHeight);

                switch ($imageFileType) {
                    case "jpg":
                    case "jpeg":
                        imagejpeg($newImageResource, $targetFilePath);
                        break;
                    case "png":
                        imagepng($newImageResource, $targetFilePath);
                        break;
                }

                imagedestroy($imageResource);
                imagedestroy($newImageResource);
            } else {
                move_uploaded_file($_FILES["file"]["tmp_name"], $targetFilePath);
            }
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
