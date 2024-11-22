package routes

import (
	"github.com/R-Thibault/FollowMyJobs/backend/config"
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

	// Initialize Utilities
	HashingService := hashingUtils.NewHashingService()
	GenerateTokenService := tokenUtils.NewJWTTokenGeneratorUtil()

	// Initialize Serivces
	UserService := userServices.NewUserService(UserRepository, OTPRepository, HashingService)
	TokenService := tokenService.NewTokenService()

	// Initialize Controllers
	AuthController := controllers.NewAuthController(UserService, HashingService, TokenService, GenerateTokenService)

	// Public routes
	router.POST("/login", AuthController.Login)
}
