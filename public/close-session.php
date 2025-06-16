<?php

    session_start();
    $_SESSION = array();
    session_unset();
    session_destroy();

    header("Cache-Control: no-cache, must-revalidate, max-age=0");
    header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");
    header("location: ../index.html");

    exit;
?>