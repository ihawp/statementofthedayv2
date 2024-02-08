<?php

include 'db_conn.php';
session_start();

$userID = intval($_SESSION['user_id']);
$filter = $_GET['filter'];

$stmtSelect = $conn->prepare("SELECT filters FROM accounts WHERE id = ?");
$stmtSelect->bind_param('i', $userID);
$stmtSelect->execute();
$stmtSelect->bind_result($currentFilters);
$stmtSelect->fetch();
$stmtSelect->close();

$filtersArray = json_decode($currentFilters, true);

$filterIndex = array_search($filter, $filtersArray);

if ($filterIndex !== false) {
    unset($filtersArray[$filterIndex]);

    if (empty($filtersArray)) {
        $newFilters = '[]';
    } else {
        $newFilters = json_encode(array_values($filtersArray));
    }

    $stmtUpdate = $conn->prepare("UPDATE accounts SET filters = ? WHERE id = ?");
    $stmtUpdate->bind_param('si', $newFilters, $userID);

    if ($stmtUpdate->execute()) {
        echo json_encode(['wow' => true]);
    } else {
        echo json_encode(['wow' => false]);
    }

    $stmtUpdate->close();
} else {
    echo json_encode(['wow' => false, 'error' => 'Filter not found']);
}
