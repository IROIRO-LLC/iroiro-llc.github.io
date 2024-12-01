<?php
session_start(); // Start a session for CSRF protection

// Generate a CSRF token if it doesn't exist
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Check CSRF token
    if (!hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
        echo json_encode(["success" => false, "message" => "Invalid CSRF token."]);
        exit;
    }

    // Collect and sanitize input data
    $firstName = filter_var(trim($_POST['first-name']), FILTER_SANITIZE_STRING);
    $lastName = filter_var(trim($_POST['last-name']), FILTER_SANITIZE_STRING);
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $message = filter_var(trim($_POST['message']), FILTER_SANITIZE_STRING);

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["success" => false, "message" => "Invalid email address."]);
        exit;
    }

    // Validate other fields to ensure they are not empty
    if (empty($firstName) || empty($lastName) || empty($message)) {
        echo json_encode(["success" => false, "message" => "All fields are required."]);
        exit;
    }

    // Prepare email
    $to = "contact@iroiro.us"; // Recipient email address
    $subject = "Sent from Contact Us page"; // Fixed subject line
    $headers = "From: $firstName $lastName <$email>\r\n"; // Sender's name and email
    $headers .= "Reply-To: $email\r\n"; // Reply-to address
    $body = "Name: $firstName $lastName\n";
    $body .= "Email: $email\n\n";
    $body .= "Message:\n$message\n";

    // Send email
    if (mail($to, $subject, $body, $headers)) {
        echo json_encode(["success" => true, "message" => "Email sent successfully!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Email sending failed."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
?>