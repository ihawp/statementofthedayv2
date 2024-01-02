<?php

$dbName = 'breaksite';
$dbHost = 'localhost';
$dbUser = 'root';
$dbPassword = '';

$conn = new mysqli($dbHost, $dbUser, $dbPassword, $dbName);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}