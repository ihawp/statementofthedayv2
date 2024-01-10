<?php

include 'db_conn.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['response'=>false]);
    exit();
} else {
    echo json_encode([
        'namee'=>$_SESSION['username'],
        'idd'=>$_SESSION['user_id'],
        'pfpp'=>$_SESSION['pfp']
    ]);
    exit();
}