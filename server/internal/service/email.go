package service

import (
	"fmt"
	"os"
	"time"
	
	"gopkg.in/gomail.v2"
)

func SendPasswordResetLink(userEmail, userName, token string) error {
	m := gomail.NewMessage()

	m.SetHeader("From", "flashquizweb@gmail.com")
	m.SetHeader("To", userEmail)
	m.SetHeader("Subject", "Reset Your Password")

	//Email body (HTML)
	htmlBody := fmt.Sprintf(`
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<style>
			body {
				font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
				background-color: #f6f9fc;
				margin: 0;
				padding: 0;
				color: #333;
			}
			.container {
				max-width: 600px;
				margin: 40px auto;
				background-color: #fff;
				padding: 30px;
				border-radius: 8px;
				box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
			}
			h1 {
				font-size: 24px;
				margin-bottom: 20px;
			}
			p {
				font-size: 16px;
				line-height: 1.6;
			}
			.btn {
				display: inline-block;
				margin-top: 25px;
				padding: 12px 24px;
				background-color: #28a745;
				color: #ffffff !important;
				text-decoration: none;
				border-radius: 6px;
				font-size: 16px;
			}
			.footer {
				margin-top: 40px;
				font-size: 13px;
				color: #888;
				text-align: center;
			}
		</style>
		</head>
		<body>
			<div class="container">
				<h1>Reset Your Password</h1>
				<p>Hey there %s</p>
				<p>We received a request to reset your password. You can reset it by clicking the button below:</p>
				<a href="https://flashquizweb.netlify.app/reset?token=%s" class="btn">Reset Password</a>
				<p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
				<div class="footer">
					&copy; %d Flashquiz. All rights reserved.
				</div>
			</div>
		</body>
		</html>
	`, userName, token, time.Now().Year())

  m.SetBody("text/html", htmlBody)

	d := gomail.NewDialer("smtp.gmail.com", 465, "flashquizweb@gmail.com", os.Getenv("APP_PASSWORD"))
	d.SSL = true

	if err := d.DialAndSend(m); err != nil {
		return err
	}

	return nil
}

func SendVerification(userEmail, userName, token string) error {
	m := gomail.NewMessage()

	m.SetHeader("From", "flashquizweb@gmail.com")
	m.SetHeader("To", userEmail)
	m.SetHeader("Subject", "Verify your FlashQuiz account.")

	// Email body (HTML)
	htmlBody := fmt.Sprintf(`
	<!DOCTYPE html>
	<html>
	<head>
	  <meta charset="UTF-8" />
	  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
	  <style>
			body {
				font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
				background-color: #f6f9fc;
				margin: 0;
				padding: 0;
				color: #333;
			}
			.container {
				max-width: 600px;
				margin: 40px auto;
				background-color: #fff;
				padding: 30px;
				border-radius: 8px;
				box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
			}
			h1 {
				font-size: 24px;
				margin-bottom: 20px;
			}
			p {
				font-size: 16px;
				line-height: 1.6;
			}
			.btn {
				display: inline-block;
				margin-top: 25px;
				padding: 12px 24px;
				background-color: #007bff;
				color: #ffffff !important;
				text-decoration: none;
				border-radius: 6px;
				font-size: 16px;
			}
			.footer {
				margin-top: 40px;
				font-size: 13px;
				color: #888;
				text-align: center;
			}
	  </style>
	</head>
	<body>
	  <div class="container">
		<h1>Verify Your Account</h1>
		<p>Hi, %s</p>
		<p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
		<a href="https://flashquizweb.netlify.app/verify?token=%s" class="btn">Verify Account</a>
		<p>If you did not sign up for this account, you can safely ignore this email.</p>
		<div class="footer">
		  &copy; %d Flashquiz. All rights reserved.
		</div>
	  </div>
	</body>
	</html>
	`, userName, token, time.Now().Year())

	m.SetBody("text/html", htmlBody)

	d := gomail.NewDialer("smtp.gmail.com", 465, "flashquizweb@gmail.com", os.Getenv("APP_PASSWORD"))
	d.SSL = true

	if err := d.DialAndSend(m); err != nil {
		return err
	}

	return nil
}

func ResendVerification(userEmail, userName, token string) error {
	m := gomail.NewMessage()

	m.SetHeader("From", "flashquizweb@gmail.com")
	m.SetHeader("To", userEmail)
	m.SetHeader("Subject", "Verify your FlashQuiz account.")
	
	// Email body (HTML)
	htmlBody := fmt.Sprintf(`
	<!DOCTYPE html>
	<html>
	<head>
	  <meta charset="UTF-8" />
	  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
	  <style>
			body {
				font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
				background-color: #f6f9fc;
				margin: 0;
				padding: 0;
				color: #333;
			}
			.container {
				max-width: 600px;
				margin: 40px auto;
				background-color: #fff;
				padding: 30px;
				border-radius: 8px;
				box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
			}
			h1 {
				font-size: 24px;
				margin-bottom: 20px;
			}
			p {
				font-size: 16px;
				line-height: 1.6;
			}
			.btn {
				display: inline-block;
				margin-top: 25px;
				padding: 12px 24px;
				background-color: #007bff;
				color: #ffffff !important;
				text-decoration: none;
				border-radius: 6px;
				font-size: 16px;
			}
			.footer {
				margin-top: 40px;
				font-size: 13px;
				color: #888;
				text-align: center;
			}
	  </style>
	</head>
	<body>
	  <div class="container">
		<h1>Verify Your Account</h1>
		<p>Hi, %s</p>
		<p>We've received your request to verify your account, kindly click the button below to proceed:</p>
		<a href="https://flashquizweb.netlify.app/verify?token=%s" class="btn">Verify Account</a>
		<p>If you did not sign up for this account, you can safely ignore this email.</p>
		<div class="footer">
		  &copy; %d Flashquiz. All rights reserved.
		</div>
	  </div>
	</body>
	</html>
	`, userName, token, time.Now().Year())

	m.SetBody("text/html", htmlBody)

	d := gomail.NewDialer("smtp.gmail.com", 465, "flashquizweb@gmail.com", os.Getenv("APP_PASSWORD"))
	d.SSL = true

	if err := d.DialAndSend(m); err != nil {
		return err
	}

	return nil
}
