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

    echo "lang";
}

if(isset($_GET['action'])) {

    if($_GET['action'] == 'scores') {
        getScores();
    } else if($_GET['action'] == 'lang') {
        getLang();
    }
}

if (isset($_GET['insert'])) {

    insert();
}