<?php
// Authentication helper functions

function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

function requireLogin() {
    if (!isLoggedIn()) {
        header("Location: ../index.php");
        exit();
    }
}

function requireAdmin() {
    requireLogin();
    if ($_SESSION['user_type'] !== 'admin') {
        header("Location: ../index.php");
        exit();
    }
}

function requireUser() {
    requireLogin();
    if ($_SESSION['user_type'] !== 'user') {
        header("Location: ../index.php");
        exit();
    }
}

function getCurrentUser() {
    if (isLoggedIn()) {
        return [
            'id' => $_SESSION['user_id'],
            'username' => $_SESSION['username'],
            'email' => $_SESSION['email'],
            'user_type' => $_SESSION['user_type'],
            'full_name' => $_SESSION['full_name']
        ];
    }
    return null;
}
?>