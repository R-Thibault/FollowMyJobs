package controllers

import (
	"log"
	"net/http"

	"github.com/R-Thibault/FollowMyJobs/backend/models"
	otpServices "github.com/R-Thibault/FollowMyJobs/backend/services/otp_services"
	registrationservices "github.com/R-Thibault/FollowMyJobs/backend/services/registration_services"
	tokenService "github.com/R-Thibault/FollowMyJobs/backend/services/token_services"
	userServices "github.com/R-Thibault/FollowMyJobs/backend/services/user_services"

	"github.com/gin-gonic/gin"
)

type UserController struct {
	UserService         userServices.UserServiceInterface
	OTPService          otpServices.OTPServiceInterface
	tokenService        tokenService.TokenServiceInterface
	Registrationservice registrationservices.RegistrationServiceInterface
}

func NewUserController(
	UserService userServices.UserServiceInterface,
	OTPService otpServices.OTPServiceInterface,
	tokenService tokenService.TokenServiceInterface,
	Registrationservice registrationservices.RegistrationServiceInterface) *UserController {
	return &UserController{
		UserService:         UserService,
		OTPService:          OTPService,
		tokenService:        tokenService,
		Registrationservice: Registrationservice}
}

func (u *UserController) SignUp(c *gin.Context) {
	// Parse the request body to extract credentials
	var creds models.Credentials
	if err := c.ShouldBindJSON(&creds); err != nil {
		// If the input is invalid, respond with an error
		log.Printf("ERROR : %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	err := u.Registrationservice.UserRegistration(creds)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": "User registration successful !"})

}
