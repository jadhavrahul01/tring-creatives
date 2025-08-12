<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // PHPMailer path

header('Content-Type: application/json');

// Basic validation
if (empty($_POST['name']) || empty($_POST['email']) || empty($_POST['message'])) {
    echo json_encode(['status' => 'error', 'message' => 'All fields are required']);
    exit;
}

if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid email address']);
    exit;
}

$name = htmlspecialchars($_POST['name']);
$email = htmlspecialchars($_POST['email']);
$message = htmlspecialchars($_POST['message']);

$mail = new PHPMailer(true);

try {
    // SMTP Settings for Hostinger
    $mail->isSMTP();
    $mail->Host = 'smtp.hostinger.com'; // Hostinger SMTP server
    $mail->SMTPAuth = true;
    $mail->Username = 'dev@acsinsights.com'; // Your Hostinger email
    $mail->Password = '8B*Y9*gVr_NcUFC';  // Your Hostinger email password
    $mail->SMTPSecure = 'tls'; // or 'ssl' if you set Port 465
    $mail->Port = 587; // TLS = 587, SSL = 465

    // Sender & Recipient
    $mail->setFrom('dev@acsinsights.com', 'Website Contact Form');
    $mail->addAddress('adarshtechdev@gmail.com'); // Where to send

    // Email content
    $mail->isHTML(true);
    $mail->Subject = 'New Contact Form Submission';
    $mail->Body = "<h3>New Inquiry</h3>
                      <p><b>Name:</b> {$name}</p>
                      <p><b>Email:</b> {$email}</p>
                      <p><b>Message:</b> {$message}</p>";

    $mail->send();
    echo json_encode(['status' => 'success']);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Message could not be sent.']);
}
