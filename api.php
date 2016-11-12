<?php
include 'db.php';

function getScores() {

    $db = new DB();

    $arr = [];
    $users = $db->getRows();
    $score;
    foreach( $users as $user) {

        $score = (string)$user['score'];
        $str = $score;
        for($i = 6; $i > (strlen($str)); $i--) {

            $score = '0' . $score;
        }
        $arr[] = (object) array('name' => $user['name'], 'score' => $score);
    }

    echo json_encode($arr);
    exit;
}


function insert() {

    $db = new DB();
    $action = $_GET['insert'];
    if($action == 'set') {

        $name = $_GET['name'];
        $score = $_GET['score'];
        $db->insert($name, $score);
    }

    getScores();
}

function getLang() {

    if(ip_info(get_client_ip_server(), 'Country') == 'Portugal') {
        return 'PT';
    } else {
        return 'ENG';
    }
}

if(isset($_GET['action'])) {

    $action = $_GET['action'];

    switch($action) {

        case 'scores':
        getScores();
        break;
        case 'insert':
        insert();
        break;
        case 'lang':
        getLang();
        break;
    }
}

if (isset($_GET['insert'])) {

    insert();
}