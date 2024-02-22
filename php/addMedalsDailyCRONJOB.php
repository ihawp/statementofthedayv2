<?php

if (isset($_SERVER['CRON_JOB']) && $_SERVER['CRON_JOB'] === 'true') {
    include 'functions.php';

    $conn->query("SET time_zone = '-06:00'");
    $currentDate = new DateTime('now', new DateTimeZone('-06:00'));
    $currentDateStr = $currentDate->format('Y-m-d');
    $startTime = $currentDateStr . ' 00:00:00';
    $endTime = $currentDateStr . ' 17:00:00';

    $stmtTopPosts = $conn->prepare('SELECT post_id, user_id, username, CONVERT_TZ(time_posted, "UTC", "-06:00") as saskatoon_timestamp 
                               FROM posts
                               WHERE time_posted BETWEEN ? AND ?
                                 AND parent_post_id = 0
                                 AND super_parent_post_id = 0
                               ORDER BY likes DESC
                               LIMIT 3');

    $stmtTopPosts->bind_param('ss', $startTime, $endTime);
    $stmtTopPosts->execute();
    $result = $stmtTopPosts->get_result();

    $topPosts = [];

    while ($row = $result->fetch_assoc()) {
        $topPosts[] = [
            'post_id' => $row['post_id'],
            'user_id' => $row['user_id'],
            'username' => $row['username']
        ];
    }
    $stmtTopPosts->close();

    // Loop through topPosts array to apply medal to all top 3 posts
    for ($i = 0; $i < 3; $i++) {
        if (isset($topPosts[$i])) {
            $post = $topPosts[$i];
            $post_id = $post['post_id'];
            $user_id = $post['user_id'];
            $placement = $i + 1;

            $stmtInsertMedal = $conn->prepare('INSERT INTO medals (post_id, user_id, placement, timestamp) VALUES (?, ?, ?, NOW(6))');
            $stmtInsertMedal->bind_param('iii', $post_id, $user_id, $placement);

            if ($stmtInsertMedal->execute()) {
                $stmtInsertMedal->close();

                $type = 'medal';
                $viewed = 0;
                $stmtInsertNotification = $conn->prepare('INSERT INTO notifications (user_id, post_id, username, noti_type, viewed, timestamp) VALUES (?, ?, ?, ?, ?, NOW(6))');
                $stmtInsertNotification->bind_param('iissi', $user_id, $post_id, $post['username'], $type, $viewed);

                if ($stmtInsertNotification->execute()) {
                    echo 'Inserted success!';
                    $stmtInsertNotification->close();
                } else {
                    echo 'Error inserting into notifications';
                    exit();
                }
            } else {
                echo 'Error inserting into medals';
                exit();
            }
        }
    }

    $conn->close();
} else {
    header('Location: ../index.html');
    exit();
}