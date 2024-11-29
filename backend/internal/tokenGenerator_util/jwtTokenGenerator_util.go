package internal

import (
	"errors"
	"fmt"
	"time"

	"github.com/R-Thibault/FollowMyJobs/backend/config"
	"github.com/R-Thibault/FollowMyJobs/backend/models"
	"github.com/golang-jwt/jwt/v5"
)

type JWTTokenGeneratorUtil struct {
}

func NewJWTTokenGeneratorUtil() *JWTTokenGeneratorUtil {
	return &JWTTokenGeneratorUtil{}
}

func (u *JWTTokenGeneratorUtil) GenerateJWTToken(tokenType string, body string, expirationTime time.Time) (JWTToken string, err error) {

	var jwtKey = []byte(config.GetConfig("JWT_KEY"))

	token := models.JWTToken{
		TokenType: &tokenType,
		Body:      &body,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	// Sign the token
	generatedToken := jwt.NewWithClaims(jwt.SigningMethodHS256, token)
	tokenString, err := generatedToken.SignedString(jwtKey)
	if err != nil {
		fmt.Printf("Failed to sign the token: %v\n", err)
		return "", errors.New("Failed to sign the token")
	}
	return tokenString, nil
}
