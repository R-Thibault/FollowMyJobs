package services

import (
	"errors"
	"fmt"
	"log"

	"github.com/R-Thibault/FollowMyJobs/backend/config"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

type MailerService struct {
}

func NewMailerService() *MailerService {
	return &MailerService{}
}

func (s *MailerService) SendEmail(toEmail string, subject string, plainTextContent string, htmlContent string) error {

	from := mail.NewEmail("Thibault Rossa", "wildshare80@gmail.com")
	to := mail.NewEmail("Recipient", toEmail)
	message := mail.NewSingleEmail(from, subject, to, plainTextContent, htmlContent)

	apiKey := config.GetConfig("SENDGRID_API_KEY")
	if apiKey == "" {
		log.Println("SENDGRID_API_KEY is not set")
		return fmt.Errorf("SENDGRID_API_KEY not set")
	}
	client := sendgrid.NewSendClient(apiKey)

	response, err := client.Send(message)

	if err != nil {
		log.Printf("Mail Response : %v\n", response)
		log.Printf("Mail Error : %v\n", err)
		return errors.New("failed to send email")
	}
	// Log the response for verification
	log.Printf("Status Code: %d\n", response.StatusCode)
	log.Printf("Response Body: %s\n", response.Body)
	log.Printf("Headers: %v\n", response.Headers)

	return nil
}

func (s *MailerService) SendOTPMail(toEmail string, otpCode string) error {
	subject := "Your One-Time Password (OTP) Verification Code"
	// HTML content for the OTP email
	htmlContent := fmt.Sprintf(`
	 <!DOCTYPE html>
	 <html>
	 <head>
			 <style>
					 body {
							 font-family: Arial, sans-serif;
					 }
					 .container {
							 max-width: 600px;
							 margin: 0 auto;
							 padding: 20px;
							 background-color: #f7f7f7;
							 border-radius: 10px;
							 box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
					 }
					 .header {
							 text-align: center;
							 padding-bottom: 20px;
					 }
					 .otp-code {
							 font-size: 24px;
							 font-weight: bold;
							 color: #007bff;
							 text-align: center;
							 padding: 10px;
							 background-color: #ffffff;
							 border-radius: 5px;
							 display: inline-block;
					 }
					 .message {
							 margin: 20px 0;
							 text-align: center;
					 }
					 .footer {
							 text-align: center;
							 color: #888888;
							 font-size: 12px;
							 padding-top: 20px;
					 }
			 </style>
	 </head>
	 <body>
			 <div class="container">
					 <div class="header">
							 <h2>One-Time Password (OTP) Verification</h2>
					 </div>
					 <div class="message">
							 <p>Hello,</p>
							 <p>Your One-Time Password (OTP) for verification is:</p>
							 <div class="otp-code">%s</div>
							 <p>This OTP will expire in 10 minutes.</p>
					 </div>
					 <div class="footer">
							 <p>If you did not request this OTP, please ignore this email.</p>
					 </div>
			 </div>
	 </body>
	 </html>
	 `, otpCode)
	plainTextContent := fmt.Sprintf("Your One-Time Password (OTP) is: %s. It will expire in 10 minutes.", otpCode)

	err := s.SendEmail(toEmail, subject, plainTextContent, htmlContent)
	if err != nil {
		return errors.New("failed to send email")
	}
	return nil
}

func (s *MailerService) SendResetPasswordEmail(toEmail string, tokenString string) error {
	subject := "Reset Your Password for FollowMyJobs"

	htmlContent := fmt.Sprintf(`
	<!DOCTYPE html>
	<html>
	<head>
		<style>
			body {
				font-family: Arial, sans-serif;
			}
			.container {
				max-width: 600px;
				margin: 0 auto;
				padding: 20px;
				background-color: #f7f7f7;
				border-radius: 10px;
				box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
			}
			.header {
				text-align: center;
				padding-bottom: 20px;
			}
			.message {
				margin: 20px 0;
				text-align: center;
			}
			.footer {
				text-align: center;
				color: #888888;
				font-size: 12px;
				padding-top: 20px;
			}
			.button {
				display: inline-block;
				padding: 10px 20px;
				font-size: 16px;
				font-weight: bold;
				color: #ffffff;
				background-color: #007bff;
				text-decoration: none;
				border-radius: 5px;
				margin-top: 20px;
			}
		</style>
	</head>
	<body>
		<div class="container">
			<div class="header">
				<h2>Password Reset Request</h2>
			</div>
			<div class="message">
				<p>Hello,</p>
				<p>We received a request to reset your password for your FollowMyJobs account. Click the link below to reset your password:</p>
				<a href="http://localhost:3000/reset-password?token=%s" class="button">Reset Password</a>
				<p>This link will expire in 60 minutes. If you did not request a password reset, please ignore this email.</p>
			</div>
			<div class="footer">
				<p>If you have any issues, please contact our support team.</p>
			</div>
		</div>
	</body>
	</html>
	`, tokenString)

	plainTextContent := fmt.Sprintf("We received a request to reset your password for FollowMyJobs. Use the following link to reset your password: http://localhost:3000/reset-password?token=%s. This link will expire in 60 minutes.", tokenString)

	err := s.SendEmail(toEmail, subject, plainTextContent, htmlContent)
	if err != nil {
		return errors.New("failed to send reset password email")
	}

	return nil
}
