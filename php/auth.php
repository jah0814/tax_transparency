<?php
session_start();

// Function to check if user is logged in
function isLoggedIn() {
    return isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true;
}

// Function to check if user is admin
function isAdmin() {
    return isLoggedIn() && isset($_SESSION['user_type']) && $_SESSION['user_type'] === 'admin';
}

// Function to require login
function requireLogin() {
    if (!isLoggedIn()) {
        $_SESSION['redirect_url'] = $_SERVER['REQUEST_URI'];
        $_SESSION['message'] = "Please log in to access this page.";
        $_SESSION['message_type'] = 'error';
        header("Location: ../index.php");
        exit();
    }
}

// Function to require admin role
function requireAdmin() {
    requireLogin();
    if (!isAdmin()) {
        $_SESSION['message'] = "Access denied. Admin privileges required.";
        $_SESSION['message_type'] = 'error';
        header("Location: ../index.php");
        exit();
    }
}

// Function to get current user data
function getCurrentUser() {
    if (isLoggedIn()) {
        return [
            'id' => $_SESSION['user_id'],
            'username' => $_SESSION['username'],
            'full_name' => $_SESSION['full_name'],
            'user_type' => $_SESSION['user_type']
        ];
    }
    return null;
}

// Function to redirect if already logged in
function redirectIfLoggedIn() {
    if (isLoggedIn()) {
        if (isAdmin()) {
            header("Location: ../admin/dashboard.php");
        } else {
            header("Location: ../user/dashboard.php");
        }
        exit();
    }
}
?>