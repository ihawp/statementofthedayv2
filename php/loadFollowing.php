<?php

include 'functions.php';


if (checkLogged() && checkRequest('GET')) {
    $userID = htmlspecialchars($_GET['user_id']);
    $offset = htmlspecialchars($_GET['offset']);
    $resultsPerPage = 25;
    $startFrom = $offset * $resultsPerPage; // once again not sure how this will turn out, perhaps I will change the JS
    $w = STMT($conn, 'SELECT a.username, a.pfp, f.followed_id
                       FROM follows f
                       JOIN accounts a ON f.followed_id = a.id
                       WHERE f.following_id = ?
                       LIMIT ? OFFSET ?', ['i','i','i'], [$userID, $resultsPerPage, $startFrom]);
    if (isset($w['result'][0][0])) {
        $following = [];
        foreach ($w['result'] as $key) {
            $following[] = [
                'username'=>$key[0],
                'pfp'=>$key[1],
                'id'=>$key[2]
            ];
        }
        echo json_encode($following);
    } else {
        echo json_encode([]);
    }
} else {
    sendHome();
}

$conn->close();
exit();
