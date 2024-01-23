<?php

// must add loading medals

include 'db_conn.php';

// Function to load user information and posts for a profile
function loadProfileData($conn, $profileID, $offset) {
    // Prepare and execute the query for user information
    $stmtUserInfo = $conn->prepare('SELECT id, username, email, last_login, account_created, follow_count, following_count, pfp, filters, medal_selection FROM accounts WHERE id = ? LIMIT 1');
    $stmtUserInfo->bind_param('i', $profileID);

    if (!$stmtUserInfo->execute()) {
        // Log the error
        error_log('Error executing user information query: ' . $stmtUserInfo->error);
        return null;
    }

    $resultUserInfo = $stmtUserInfo->get_result();

    // Fetch user information
    $userInfo = $resultUserInfo->fetch_assoc();

    // Close the statement for user information
    $stmtUserInfo->close();

    if ($userInfo === null) {
        // Log that user information was not found
        error_log('User information not found for user ID: ' . $profileID);
    }

    // Decode the JSON string in medal_selection into a PHP array
    $userInfo['medal_selection'] = json_decode($userInfo['medal_selection']);

    // Define your SQL query to retrieve the latest posts for the profile
    $sqlPosts = 'SELECT post_id, content, username, user_id, likes, comments, CONVERT_TZ(time_posted, "UTC", "-06:00") as saskatoon_timestamp
                 FROM posts
                 WHERE user_id = ?
                 ORDER BY time_posted DESC
                 LIMIT 25 OFFSET ?;';

    // Prepare and execute the query for posts
    $stmtPosts = $conn->prepare($sqlPosts);
    $stmtPosts->bind_param('ii', $profileID, $offset);

    if (!$stmtPosts->execute()) {
        // Log the error
        error_log('Error executing posts query: ' . $stmtPosts->error);
        return null;
    }

    $resultPosts = $stmtPosts->get_result();

    // Fetch posts
    $posts = [];
    while ($row = $resultPosts->fetch_assoc()) {
        $posts[] = [
            'post_id'=>$row['post_id'],
            'user_id'=>$row['user_id'],
            'content'=>$row['content'],
            'username'=>$row['username'],
            'likes'=>$row['likes'],
            'comments'=>$row['comments'],
            'pfp'=>$userInfo['pfp'],  // Include pfp from accounts table
            'medal_selection'=>$userInfo['medal_selection']  // Include medal_selection from accounts table
        ];
    }

    // Close the statement for posts
    $stmtPosts->close();

    // Return the user information and posts as an associative array
    return ['user_info' => $userInfo, 'posts' => $posts];
}

// Check if the request contains a profile_id and offset
if (isset($_GET['profile_id']) && isset($_GET['offset'])) {
    $profileID = $_GET['profile_id'];
    $offset = $_GET['offset'];

    // Call the function to load profile data
    $profileData = loadProfileData($conn, $profileID, $offset);

    // Send the profile data as JSON
    echo json_encode($profileData);
} else {
    // If profile_id or offset is not provided, return an error message
    echo json_encode(['error' => 'Invalid request']);
}

// Close the database connection
$conn->close();
exit();

