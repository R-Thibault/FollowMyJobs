package controllers

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/R-Thibault/FollowMyJobs/backend/models"
	"github.com/R-Thibault/FollowMyJobs/backend/services"
	otpServices "github.com/R-Thibault/FollowMyJobs/backend/services/otp_services"
	userServices "github.com/R-Thibault/FollowMyJobs/backend/services/user_services"

	"github.com/gin-gonic/gin"
)

type OTPController struct {
	OTPService    otpServices.OTPServiceInterface
	UserService   userServices.UserServiceInterface
	MailerService *services.MailerService
}

func NewOTPController(OTPService otpServices.OTPServiceInterface, MailerService *services.MailerService, UserService userServices.UserServiceInterface) *OTPController {

	return &OTPController{OTPService: OTPService, MailerService: MailerService, UserService: UserService}
}

func (u *OTPController) GenerateOTPForSignUp(c *gin.Context) {
	var creds models.Credentials
	if err := c.ShouldBindJSON(&creds); err != nil {
		// If the input is invalid, respond with an error
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}
	user, err := u.UserService.GetUserByEmail(creds.Email)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}
	expirationTime := time.Now().Add(48 * time.Hour)
	Otp, err := u.OTPService.GenerateOTP(user.ID, "emailValidation", expirationTime)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"otp": "OTP generated successfully"})

	go func() {
		// Create the request payload
		requestBody := models.SendOTPRequest{
			Email:   creds.Email,
			OtpCode: Otp,
		}

		// Convert the payload to JSON
		jsonData, err := json.Marshal(requestBody)
		if err != nil {
			log.Printf("Error marshalling JSON: %v", err)
			return
		}
		client := &http.Client{}
		req, err := http.NewRequest("POST", "http://localhost:8080/send-otp", bytes.NewBuffer(jsonData))
		if err != nil {
			log.Printf("Error creating request to send OTP: %v", err)
			return
		}
		req.Header.Set("Content-type", "application/json")
		req.Header.Set("Content-type", "application/json")
		resp, err := client.Do(req)
		if err != nil {
			log.Printf("Error sending OTP: %v\n", err)
			return
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			bodyBytes, _ := io.ReadAll(resp.Body)
			log.Printf("Error sending OTP: Received status code %d, response: %s", resp.StatusCode, string(bodyBytes))
		} else {
			log.Printf("OTP sent successfully")
		}
	}()
}

func (u *OTPController) SendOTP(c *gin.Context) {
	var request models.SendOTPRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		// If the input is invalid, respond with an error
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	err := u.MailerService.SendOTPMail(request.Email, request.OtpCode)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "OTP Successfully send"})
}

func (u *OTPController) ValidateOTPForSignUp(c *gin.Context) {
	var request models.SendOTPRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		log.Printf("Error OTP : %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}
	otpType := "emailValidation"
	err := u.OTPService.VerifyOTPGiven(request.Email, otpType, request.OtpCode)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}
	errValidate := u.UserService.EmailValidation(request.Email)
	if errValidate != nil {
		c.JSON(http.StatusConflict, gin.H{"error": errValidate.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "OTP is valid"})
}
