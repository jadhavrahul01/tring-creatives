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

if (empty($phone)) {
    $errors[] = 'Phone number is required';
} elseif (!preg_match('/^\+?[0-9\s\-()]{7,15}$/', $phone)) {
    $errors[] = 'Invalid phone number format';
} elseif (strlen($phone) > 20) {
    $errors[] = 'Phone number cannot exceed 20 characters';
}

if (empty($service)) {
    $errors[] = 'Service is required';
} elseif (strlen($service) < 2) {
    $errors[] = 'Service must be at least 2 characters long';
} elseif (strlen($service) > 100) {
    $errors[] = 'Service cannot exceed 100 characters';
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
$phone = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
$service = htmlspecialchars($service, ENT_QUOTES, 'UTF-8');
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

    $currentDateTime = date('d M Y, h:i A');
    $dayOfWeek = date('l');
    // Create beautiful HTML email template
    $htmlBody = "
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background-color: #f5f5f5;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #667eea, #764ba2);
            padding: 30px 25px;
            text-align: center;
            position: relative;
        }
        .header h1 {
            color: white;
            font-size: 26px;
            font-weight: 700;
            margin-bottom: 10px;
        }
        .source-tag { 
            background: linear-gradient(135deg, #fecb10, #ec5f3b);
            color: white; 
            padding: 8px 20px; 
            border-radius: 25px; 
            font-size: 14px; 
            font-weight: 600;
            display: inline-block;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        .content { 
            padding: 30px 25px; 
            background: white;
        }
        .field { 
            margin-bottom: 20px; 
            padding: 15px;
            background: #f8f9fa;
            border-radius: 10px;
            border-left: 4px solid #667eea;
            transition: all 0.3s ease;
        }
        .field:hover {
            background: #e9ecef;
            transform: translateX(5px);
        }
        .label { 
            font-weight: 700; 
            color: #2c3e50;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
            display: block;
        }
        .value { 
            color: #34495e;
            font-size: 16px;
            font-weight: 500;
            word-wrap: break-word;
        }
        .message-field {
            background: #fff3cd;
            border-left: 4px solid #fecb10;
        }
        .message-field .value {
            background: white;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e9ecef;
            margin-top: 8px;
        }
        .datetime-field {
            background: linear-gradient(135deg, #e3f2fd, #f3e5f5);
            border-left: 4px solid #009add;
        }
        .footer {
            background: linear-gradient(135deg, #2c3e50, #34495e);
            color: white;
            padding: 20px 25px;
            text-align: center;
            font-size: 14px;
        }
        .footer p {
            margin-bottom: 5px;
        }
        @media (max-width: 600px) {
            .email-container {
                margin: 10px;
                border-radius: 10px;
            }
            .header {
                padding: 20px 15px;
            }
            .content {
                padding: 20px 15px;
            }
        }
    </style>
</head>
<body>
    <div class='email-container'>
        <div class='header'>
            <h1>📧 New Contact Form Submission</h1>
            <div class='source-tag'>Tring Website</div>
        </div>
        
        <div class='content'>
            <div class='field'>
                <span class='label'>👤 Full Name</span>
                <span class='value'>$name</span>
            </div>
            
            <div class='field'>
                <span class='label'>📧 Email Address</span>
                <span class='value'><a href='mailto:$email'>$email</a></span>
            </div>
            
            <div class='field'>
                <span class='label'>📞 Phone Number</span>
                <span class='value'>$phone</span>
            </div>

            <div class='field'>
                <span class='label'>🛠️ Service Interested In</span>
                <span class='value'>$service</span>
            </div>";

    if (!empty($message)) {
        $htmlBody .= "
            <div class='field message-field'>
                <span class='label'>💬 Message</span>
                <div class='value'>" . nl2br(htmlspecialchars($message)) . "</div>
            </div>";
    }

    $htmlBody .= "
            <div class='field datetime-field'>
                <span class='label'>🕒 Received on</span>
                <div class='value'>$currentDateTime ($dayOfWeek)</div>
            </div>
        </div>
        
        <div class='footer'>
                <p><strong> Tring Creatives – Enquiry Notification</strong></p>
                <p>You have received a new contact form enquiry from your website.</p>
                <p style='margin-top: 10px; font-size: 12px; opacity: 0.8;'>
                    Please respond to the customer within 24 hours for better conversion.
                </p>
            </div>
    </div>
</body>
</html>";


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