<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require 'vendor/autoload.php'; // PHPMailer path

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Input validation and sanitization
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');

// Validation
$errors = [];

if (empty($name)) {
    $errors[] = 'Name is required';
} elseif (strlen($name) < 2) {
    $errors[] = 'Name must be at least 2 characters long';
} elseif (strlen($name) > 100) {
    $errors[] = 'Name cannot exceed 100 characters';
}

if (empty($email)) {
    $errors[] = 'Email is required';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Invalid email address';
} elseif (strlen($email) > 320) {
    $errors[] = 'Email address too long';
}

if (empty($message)) {
    $errors[] = 'Message is required';
} elseif (strlen($message) < 10) {
    $errors[] = 'Message must be at least 10 characters long';
} elseif (strlen($message) > 5000) {
    $errors[] = 'Message cannot exceed 5000 characters';
}

// If there are validation errors, return them
if (!empty($errors)) {
    echo json_encode([
        'status' => 'error',
        'message' => implode('. ', $errors)
    ]);
    exit;
}

// Sanitize input
$name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$email = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

// Create PHPMailer instance
$mail = new PHPMailer(true);

try {
    // SMTP Settings for Hostinger
    $mail->isSMTP();
    $mail->Host = 'smtp.hostinger.com'; // Hostinger SMTP server
    $mail->SMTPAuth = true;
    $mail->Username = 'dev@acsinsights.com'; // Your Hostinger email
    $mail->Password = '8B*Y9*gVr_NcUFC';  // Your Hostinger email password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587; // TLS port
    
    // For debugging (remove in production)
    // $mail->SMTPDebug = SMTP::DEBUG_SERVER;

    // Sender settings
    $mail->setFrom('dev@acsinsights.com', 'Website Contact Form');
    $mail->addReplyTo($email, $name); // User can reply directly to the sender
    
    // Recipient
    $mail->addAddress('adarshtechdev@gmail.com', 'Support Team');
    
    // Email content
    $mail->isHTML(true);
    $mail->Subject = 'New Contact Form Submission from ' . $name;
    
    // Create beautiful HTML email template
    $htmlBody = '
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
        <style>
            body {
                font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background: white;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 600;
            }
            .header p {
                margin: 5px 0 0 0;
                opacity: 0.9;
            }
            .content {
                padding: 30px;
            }
            .field {
                margin-bottom: 25px;
                padding-bottom: 15px;
                border-bottom: 1px solid #eee;
            }
            .field:last-child {
                border-bottom: none;
                margin-bottom: 0;
            }
            .field-label {
                font-weight: 600;
                color: #555;
                margin-bottom: 8px;
                display: block;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .field-value {
                color: #333;
                font-size: 16px;
                word-wrap: break-word;
            }
            .message-field {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #667eea;
            }
            .footer {
                background: #f8f9fa;
                padding: 20px;
                text-align: center;
                color: #666;
                font-size: 12px;
            }
            .timestamp {
                color: #999;
                font-size: 12px;
                margin-top: 10px;
            }
            .icon {
                display: inline-block;
                width: 20px;
                height: 20px;
                margin-right: 8px;
                vertical-align: middle;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📧 New Contact Form Submission</h1>
                <p>Someone reached out to you through your website</p>
            </div>
            
            <div class="content">
                <div class="field">
                    <span class="field-label">👤 Full Name</span>
                    <div class="field-value">' . $name . '</div>
                </div>
                
                <div class="field">
                    <span class="field-label">📧 Email Address</span>
                    <div class="field-value"><a href="mailto:' . $email . '">' . $email . '</a></div>
                </div>
                
                <div class="field">
                    <span class="field-label">💬 Message</span>
                    <div class="field-value message-field">' . nl2br($message) . '</div>
                </div>
                
                <div class="timestamp">
                    🕒 Received on: ' . date('F j, Y \a\t g:i A') . ' (IST)
                </div>
            </div>
            
            <div class="footer">
                <p>This email was sent from your website contact form.</p>
                <p>To reply, simply click the email address above or reply to this message.</p>
            </div>
        </div>
    </body>
    </html>';
    
    $mail->Body = $htmlBody;
    
    // Plain text version for email clients that don\'t support HTML
    $mail->AltBody = "New Contact Form Submission\n\n" .
                     "Name: $name\n" .
                     "Email: $email\n" .
                     "Message: $message\n\n" .
                     "Received on: " . date('F j, Y \a\t g:i A') . " (IST)";

    // Send email
    $mail->send();
    
    // Log successful submission (optional)
    error_log("Contact form submitted successfully by: $email at " . date('Y-m-d H:i:s'));
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Your message has been sent successfully!'
    ]);

} catch (Exception $e) {
    // Log error details
    error_log("Contact form submission failed: " . $mail->ErrorInfo);
    
    echo json_encode([
        'status' => 'error',
        'message' => 'Sorry, there was an error sending your message. Please try again later.'
    ]);
}
?>