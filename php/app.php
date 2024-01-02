<?php

include 'db_conn.php';
session_start();

echo $_SESSION['username'];
echo $_SESSION['user_id'];

echo '<br>Welcome ', $_SESSION['username'];