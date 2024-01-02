<?php

include 'php/db_conn.php';

if (!isset($_SESSION['user_id'])) {
    return false;
} else {
    return true;
}