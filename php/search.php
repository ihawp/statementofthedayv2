<?php


include 'functions.php';

if (checkLogged() && checkRequest('GET')) {
    $search = htmlspecialchars($_GET['search']);
    $users = array();
    $w = STMT($conn, "SELECT id, username, pfp FROM accounts WHERE username LIKE ? LIMIT 100", ['s'], [$search."%"]);

    if (isset($w['result'][0][0])) {
        foreach ($w['result'] as $key) {
            $users[] = [
                'id'=> $key[0],
                'username'=>$key[1],
                'pfp'=>$key[2]
            ];
        }
    }

    echo json_encode([$users, 'term'=>$search]);
} else {
    sendHome();
}