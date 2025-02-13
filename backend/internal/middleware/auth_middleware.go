package middleware

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"

	"github.com/R-Thibault/FollowMyJobs/backend/config"
	"github.com/R-Thibault/FollowMyJobs/backend/models"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// AuthMiddleware checks if the request contains a valid JWT token in the cookie.
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Attempt to retrieve the token from cookies
		tokenString, err := c.Cookie("auth_token")
		if err != nil {
			log.Println("No token provided")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "No token provided"})
			c.Abort()
			return
		}
		log.Printf("Token retrieved: %s", tokenString)

		// JWT key for validation
		var jwtKey = []byte(config.GetConfig("JWT_KEY"))
		log.Println("JWT key retrieved from config")

		// Parse the token
		token, err := jwt.ParseWithClaims(tokenString, &models.JWTToken{}, func(token *jwt.Token) (interface{}, error) {
			// Ensure the signing method is correct
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				log.Printf("Unexpected signing method: %v", token.Header["alg"])
				return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
			}
			return jwtKey, nil
		})

		if err != nil {
			// Handle specific JWT errors
			if errors.Is(err, jwt.ErrTokenExpired) {
				log.Println("Token expired")
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Token expired"})
			} else if errors.Is(err, jwt.ErrTokenMalformed) {
				log.Println("Malformed token")
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Malformed token"})
			} else if errors.Is(err, jwt.ErrTokenNotValidYet) {
				log.Println("Token not valid yet")
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Token not valid yet"})
			} else {
				log.Printf("Invalid token: %v", err)
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			}
			c.Abort()
			return
		}

		// Access claims if the token is valid
		if claims, ok := token.Claims.(*models.JWTToken); ok && token.Valid {
			log.Printf("Token claims validated: %+v", claims)

			// Parse body content from token claims
			var bodyContent map[string]interface{}
			if err := json.Unmarshal([]byte(*claims.Body), &bodyContent); err != nil {
				log.Println("Failed to parse token body")
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Failed to parse token body"})
				c.Abort()
				return
			}
			log.Printf("Token body content: %+v", bodyContent)

			// Extract userUUID and userRole from the token body content
			userUUID, uuidExists := bodyContent["userUUID"].(string)
			if !uuidExists {
				log.Println("Invalid token: required user data missing")
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token: required user data missing"})
				c.Abort()
				return
			}
			log.Printf("User UUID: %s", userUUID)

			// Store userUUID and userRole in context for further use
			c.Set("userUUID", userUUID)
		} else {
			log.Println("Invalid token: token claims are not valid")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		// Continue to the next handler
		c.Next()
	}
}
