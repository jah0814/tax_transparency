<?php
session_start();
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];
    
    try {
        // Check if user exists
        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? OR email = ?");
        $stmt->execute([$username, $username]);
        $user = $stmt->fetch();
        
        if ($user && password_verify($password, $user['password'])) {
            if ($user['is_active']) {
                // Set session variables
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['user_type'] = $user['user_type'];
                $_SESSION['email'] = $user['email'];
                $_SESSION['full_name'] = $user['full_name'];
                $_SESSION['login_time'] = time();
                
                // Update last login
                $updateStmt = $pdo->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
                $updateStmt->execute([$user['id']]);
                
                // Set success message
                $_SESSION['message'] = 'Login successful! Welcome back, ' . $user['full_name'] . '.';
                $_SESSION['message_type'] = 'success';
                
                // Redirect based on user role
                if ($user['user_type'] === ROLE_ADMIN) {
                    header("Location: ../admin/dashboard.php");
                } else {
                    header("Location: ../user/dashboard.php");
                }
                exit();
            } else {
                $_SESSION['message'] = 'Your account has been deactivated. Please contact administrator.';
                $_SESSION['message_type'] = 'error';
                header("Location: ../index.php");
                exit();
            }
        } else {
            $_SESSION['message'] = 'Invalid username or password. Please try again.';
            $_SESSION['message_type'] = 'error';
            header("Location: ../index.php");
            exit();
        }
        
    } catch (PDOException $e) {
        error_log("Login error: " . $e->getMessage());
        $_SESSION['message'] = 'System error. Please try again later.';
        $_SESSION['message_type'] = 'error';
        header("Location: ../index.php");
        exit();
    }
} else {
    header("Location: ../index.php");
    exit();
}
?>