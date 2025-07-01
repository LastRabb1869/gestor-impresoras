<?php

    session_start();
    $_SESSION = array();

    header("Cache-Control: no-cache, must-revalidate, max-age=0");
    header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");
    session_unset();
    session_destroy();
    header("location: ../index.html");
    //header("location: https://192.168.0.10:8000/index.html");

    exit;
?>