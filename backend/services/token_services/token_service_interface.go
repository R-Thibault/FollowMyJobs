package tokenservices

import "github.com/R-Thibault/FollowMyJobs/backend/models"

type TokenServiceInterface interface {
	// VerifyToken takes a token string as input and returns a pointer to a JWTToken
	// model and an error. It verifies the validity of the provided token string.
	VerifyToken(tokenString string) (*models.JWTToken, error)
}
