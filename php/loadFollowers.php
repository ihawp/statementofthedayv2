<?php


include 'functions.php';

if (checkLogged() && checkRequest('GET')) {
    $userID = htmlspecialchars($_GET['user_id']);
    $offset = htmlspecialchars($_GET['offset']);
    $resultsPerPage = 25;
    $startFrom = $offset * $resultsPerPage; // don't know how this will turn out
                                            // once someone actually reaches
                                            // 25 followers, I think the offset would need to be
                                            // incremented by 1 each time, not 25, which it is probably
                                            // currently set to.
    $w = STMT($conn, 'SELECT a.username, a.pfp, f.following_id
                       FROM follows f
                       JOIN accounts a ON f.following_id = a.id
                       WHERE f.followed_id = ?
                       LIMIT ? OFFSET ?', ['i','i','i'], [$userID, $resultsPerPage, $startFrom]);
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

