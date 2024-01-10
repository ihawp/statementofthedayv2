<?php

include 'db_conn.php';
session_start();


// add noGoPage(); function for securtity stuffjfh skj
// have it return true or false
function noGoPage() {
    return true;
}

function stmtGET($conn, $STATEMENT, $PARAM, $VARIABLE) {
    $stmt = $conn->prepare($STATEMENT);
    $stmt->bind_param($PARAM, $VARIABLE);
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            return $result;
        } else {
            return 'no result';
        }
    } else {
        return 'stmt did not execute';
    }
}

function getUserID($conn) {
    if (!isset($_SESSION['user_id'])) {
        $wow = stmtGET($conn, 'SELECT id FROM accounts WHERE username = ?', 's', $_SESSION['username']);
        $row = $wow->fetch_assoc();
        return $row['id'];
    }
}
