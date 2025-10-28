<?php
session_start();

// Database configuration
$host = 'localhost';
$dbname = 'barangay_fiscal_portal';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    $_SESSION['message'] = "Database connection failed. Please try again later.";
    $_SESSION['message_type'] = 'error';
    header("Location: ../index.php");
    exit();
}

// Only process POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input_username = trim($_POST['username'] ?? '');
    $input_password = trim($_POST['password'] ?? '');

    // Basic validation
    if (empty($input_username) || empty($input_password)) {
        $_SESSION['message'] = "Please enter both username and password.";
        $_SESSION['message_type'] = 'error';
        header("Location: ../index.php");
        exit();
    }

    try {
        // Check user
        $stmt = $pdo->prepare("
            SELECT id, username, email, password, full_name, user_type, is_active 
            FROM users 
            WHERE (username = ? OR email = ?) AND is_active = TRUE
        ");
        $stmt->execute([$input_username, $input_username]);
        $user = $stmt->fetch();

        if ($user && password_verify($input_password, $user['password'])) {
            // Login successful
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['full_name'] = $user['full_name'];
            $_SESSION['user_type'] = $user['user_type'];
            $_SESSION['logged_in'] = true;
            
            $_SESSION['message'] = "Welcome back, " . $user['full_name'] . "!";
            $_SESSION['message_type'] = 'success';
            
            // Redirect based on user type
            if ($user['user_type'] === 'admin') {
                header("Location: ../admin/dashboard.php");
            } else {
                header("Location: ../user/dashboard.php");
            }
            exit();
            
        } else {
            // Login failed
            $_SESSION['message'] = "Invalid username or password.";
            $_SESSION['message_type'] = 'error';
            header("Location: ../");
            exit();
        }
        
    } catch (PDOException $e) {
        $_SESSION['message'] = "Login error. Please try again.";
        $_SESSION['message_type'] = 'error';
        header("Location: ../index.php");
        exit();
    }
} else {
    // Not a POST request - redirect to home
    header("Location: ../index.php");
    exit();
}
?>