<?php
include 'db.php';

function getScores() {

    $db = new DB();

    $arr = [];
    $users = $db->getRows();
    $score;
    foreach( $users as $user) {

        $score = (string)$user['score'];
        if(strlen($score) == 2) {
            $score = '0' . $score;
        } else if(strlen($score) == 1) {
            $score = '00' . $score;
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

if(isset($_GET['action'])) {

    getScores();
}

if (isset($_GET['insert'])) {

    insert();
}