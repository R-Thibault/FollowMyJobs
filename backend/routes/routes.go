package routes

import (
	"github.com/R-Thibault/FollowMyJobs/backend/config"
	"github.com/R-Thibault/FollowMyJobs/backend/controllers"
	hashingUtils "github.com/R-Thibault/FollowMyJobs/backend/internal/hash_util"
	otpGeneratorUtils "github.com/R-Thibault/FollowMyJobs/backend/internal/otpGenerator_util"
	tokenUtils "github.com/R-Thibault/FollowMyJobs/backend/internal/tokenGenerator_util"
	otpRepository "github.com/R-Thibault/FollowMyJobs/backend/repository/otp_repository"
	userRepository "github.com/R-Thibault/FollowMyJobs/backend/repository/user_repository"
	"github.com/R-Thibault/FollowMyJobs/backend/services"
	otpServices "github.com/R-Thibault/FollowMyJobs/backend/services/otp_services"
	registrationservices "github.com/R-Thibault/FollowMyJobs/backend/services/registration_services"
	tokenService "github.com/R-Thibault/FollowMyJobs/backend/services/token_services"
	userServices "github.com/R-Thibault/FollowMyJobs/backend/services/user_services"

	"github.com/gin-gonic/gin"
)

// SetupRoutes sets up the API routes
func SetupRoutes(router *gin.Engine) {

	// Define a simple root route for health check
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Server Start with succes !",
		})
	})

	// Initialize repositories
	UserRepository := userRepository.NewUserRepository(config.DB)
	OTPRepository := otpRepository.NewOTPRepository(config.DB)

	// Initialize Utilities
	HashingService := hashingUtils.NewHashingService()
	GenerateTokenService := tokenUtils.NewJWTTokenGeneratorUtil()
	OTPGeneratorService := otpGeneratorUtils.NewOtpGeneratorService()

	// Initialize Serivces
	UserService := userServices.NewUserService(UserRepository, OTPRepository, HashingService)
	TokenService := tokenService.NewTokenService()
	OTPService := otpServices.NewOTPService(UserRepository, OTPRepository, OTPGeneratorService)
	MailerService := services.NewMailerService()
	RegistrationService := registrationservices.NewRegistrationService(UserRepository, HashingService)

	// Initialize Controllers
	AuthController := controllers.NewAuthController(UserService, HashingService, TokenService, GenerateTokenService)
	UserController := controllers.NewUserController(UserService, OTPService, TokenService, RegistrationService)
	OTPController := controllers.NewOTPController(OTPService, MailerService, UserService)
	TokenController := controllers.NewTokenController(TokenService, UserService, OTPService, GenerateTokenService, *MailerService)

	// Public routes
	router.POST("/login", AuthController.Login)
	router.POST("/logout", AuthController.Logout)
	router.POST("/sign-up", UserController.SignUp)
	router.POST("/generate-otp", OTPController.GenerateOTPForSignUp)
	router.POST("/send-otp", OTPController.SendOTP) // Not use on frontend only called on backend
	router.POST("/verify-otp", OTPController.ValidateOTPForSignUp)
	router.POST("/reset-password", UserController.ResetPassword)
	router.POST("/send-reset-password-link", TokenController.SendResetPasswordEmail)
	router.POST("/verify-reset-password-link", TokenController.VerifyResetPasswordToken)
}
