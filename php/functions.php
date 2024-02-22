<?php

include 'db_conn.php';
session_start();


// only for single value search
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

// Credit:
// technically not for the entire function there were some errors
// but I got my code for this function from here.
// https://www.pontikis.net/blog/dynamically-bind_param-array-mysqli
function STMT($conn, $stmt, array $a_param_type, array $a_bind_params): array {
    $a_params = array();
    $param_type = '';
    $n = count($a_param_type);
    for($i = 0; $i < $n; $i++) {
        $param_type .= $a_param_type[$i];
    }

    $a_params[] = &$param_type;
    for($i = 0; $i < $n; $i++) {
        $a_params[] = & $a_bind_params[$i];
    }

    $stmt = $conn->prepare($stmt);
    if ($stmt === false) {
        return array('result'=>false);
    }

    call_user_func_array(array($stmt, 'bind_param'), $a_params);
    $stmt->execute();

    $result = $stmt->get_result();
    $rows = array();
    if ($result !== false) {
        while ($row = $result->fetch_row()) {
            $rows[] = $row;
        }
    }
    $stmt->close();

    if (count($rows) === 0) {
        return array('result'=>true);
    } else {
        return array('result'=>$rows);
    }
}


function getUserID($conn): int {
    $wow = stmtGET($conn, 'SELECT id FROM accounts WHERE username = ?', 's', $_SESSION['username'])->fetch_assoc();
    return $wow['id'];
}

function checkLogged(): bool {
    if (isset($_SESSION['user_id'])) {
        return true;
    } else {
        return false;
    }
}

function checkRequest(string $type): bool {
    if ($_SERVER['REQUEST_METHOD'] === $type) {
        return true;
    }
    return false;
}

function sendHome() {
    header('Location: ../index.html?page=home');
}



function checkForRow() {

}

function getResult() {

}
