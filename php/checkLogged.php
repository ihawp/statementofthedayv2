<?php

include 'functions.php';


if (checkRequest('GET')) {
    if (checkLogged()) {
        $w = intval($_SESSION['user_id']);
        $wow = null;
        $c = STMT($conn, 'SELECT medal_selection FROM accounts WHERE id = ? LIMIT 1', ['i'], [$w]);
        if ($c['result'][0][0]) {
            $wow = $c['result'][0][0];
            echo json_encode([
                'namee'=>$_SESSION['username'],
                'idd'=>$_SESSION['user_id'],
                'pfpp'=>$_SESSION['pfp'],
                'medal'=>$wow
            ]);
        }
    } else {
        echo json_encode(['response'=>false]);
    }
} else {
    sendHome();
}
$conn->close();
exit();