<?php
session_start();

// Unset all session variables
$_SESSION = array();

// Destroy the session
session_destroy();

// Set logout message
session_start();
$_SESSION['message'] = 'You have been successfully logged out.';
$_SESSION['message_type'] = 'info';

header("Location: ../index.php");
exit();
?>