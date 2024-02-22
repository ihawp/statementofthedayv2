<?php


include 'functions.php';

if (checkLogged() && checkRequest('GET')) {
    $userID = htmlspecialchars($_GET['user_id']);
    $offset = htmlspecialchars($_GET['offset']);
    $resultsPerPage = 25;
    $w = STMT($conn, 'SELECT a.username, a.pfp, f.following_id
                       FROM follows f
                       JOIN accounts a ON f.following_id = a.id
                       WHERE f.followed_id = ?
                       LIMIT ? OFFSET ?', ['i','i','i'], [$userID, $resultsPerPage, $offset]);
    if (isset($w['result'][0][0])) {
        $followers = [];
        foreach ($w['result'] as $key) {
            $followers[] = [
                'username' => $key[0],
                'pfp' => $key[1],
                'id'=>$key[2]
            ];
        }
        echo json_encode($followers);
    } else {
        echo json_encode([]);
    }
} else {
    sendHome();
}

$conn->close();
exit();

