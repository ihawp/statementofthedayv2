<?php

include 'db_conn.php';
session_start();

// Credit for the assist: https://www.pontikis.net/blog/dynamically-bind_param-array-mysqli
function STMT($conn, string $stmt, array $a_param_type, array $a_bind_params): array {
    $a_params = array();
    $param_type = '';
    $n = count($a_param_type);
    for($i = 0; $i < $n; $i++) {
        $param_type .= $a_param_type[$i];
    }

    $a_params[] = &$param_type;
    for($i = 0; $i < $n; $i++) {
        $a_params[] = &$a_bind_params[$i];
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

function removeFollow($conn, int $toBeFollowedID, int $userID, int $uploadUserID, string $typeParam):bool {
    $w = STMT($conn, 'DELETE FROM follows WHERE followed_id = ? AND following_id = ?', ['i', 'i'], [$toBeFollowedID, $uploadUserID]);
    if ($w['result']) {
        STMT($conn, 'UPDATE accounts SET following_count = following_count - 1 WHERE id = ?', ['i'], [$uploadUserID]);
        STMT($conn, 'UPDATE accounts SET follow_count = follow_count - 1 WHERE id = ?', ['i'], [$toBeFollowedID]);
        $w = STMT($conn, 'SELECT username FROM accounts WHERE id = ? LIMIT 1', ['i'], [$userID]);
        if ($w['result'][0][0]) {
            $followingUsername = strval($w['result'][0][0]);

            $stmt = $conn->prepare('DELETE FROM notifications WHERE user_id = ? AND noti_type = ? AND username = ?');
            $stmt->bind_param('iss', $toBeFollowedID, $typeParam, $followingUsername);

            $w = STMT($conn, 'DELETE FROM notifications WHERE user_id = ? AND noti_type = ? AND username = ?', ['i', 's', 's'], [$toBeFollowedID, $typeParam, $followingUsername]);

            if ($w['result'] === true) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}
function addFollow($conn, int $toBeFollowedID, int $userID, int $uploadUserID, string $typeParam):bool {
    $w = STMT($conn, 'INSERT INTO follows (followed_id, following_id, timestamp) VALUES (?, ?, NOW(6))', ['i', 'i'], [$toBeFollowedID, $uploadUserID]);
    if ($w['result']) {
        STMT($conn, 'UPDATE accounts SET following_count = following_count + 1 WHERE id = ?', ['i'], [$uploadUserID]);
        STMT($conn, 'UPDATE accounts SET follow_count = follow_count + 1 WHERE id = ?', ['i'], [$toBeFollowedID]);
        $w = STMT($conn, 'SELECT username FROM accounts WHERE id = ? LIMIT 1', ['i'], [$userID]);
        if (isset($w['result'][0][0])) {
            $followingUsername = strval($w['result'][0][0]);
            $w = STMT($conn, 'INSERT INTO notifications (username, user_id, post_id, noti_type, timestamp) VALUES (?, ?, ?,?, NOW(6))', ['s', 'i', 'i', 's'], [$followingUsername, $toBeFollowedID, $userID, $typeParam]);
            if ($w['result']) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}


// start encapsulating stuff so that it can be used in other places? or do I still have to work on more efficient methods of data'ing?
function blockUser() {

}
function unblockUser() {

}
