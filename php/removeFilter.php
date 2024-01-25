<?php

include 'db_conn.php';
session_start();

$userID = intval($_SESSION['user_id']);
$filter = $_GET['filter'];

// Retrieve the current filters for the user
$stmtSelect = $conn->prepare("SELECT filters FROM accounts WHERE id = ?");
$stmtSelect->bind_param('i', $userID);
$stmtSelect->execute();
$stmtSelect->bind_result($currentFilters);
$stmtSelect->fetch();
$stmtSelect->close();

// Decode the JSON string to an array
$filtersArray = json_decode($currentFilters, true);

// Check if the specified filter exists in the array
$filterIndex = array_search($filter, $filtersArray);

if ($filterIndex !== false) {
    // Remove the filter from the array
    unset($filtersArray[$filterIndex]);

    // Check if it was the last item in the list
    if (empty($filtersArray)) {
        $newFilters = '[]'; // Reset to an empty array
    } else {
        // Encode the updated array back to JSON
        $newFilters = json_encode(array_values($filtersArray));
    }

    // Update the filters column in the database
    $stmtUpdate = $conn->prepare("UPDATE accounts SET filters = ? WHERE id = ?");
    $stmtUpdate->bind_param('si', $newFilters, $userID);

    if ($stmtUpdate->execute()) {
        echo json_encode(['wow' => true]);
    } else {
        echo json_encode(['wow' => false]);
    }

    $stmtUpdate->close();
} else {
    // The specified filter was not found in the array
    echo json_encode(['wow' => false, 'error' => 'Filter not found']);
}
