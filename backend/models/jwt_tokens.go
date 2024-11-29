package models

import "github.com/golang-jwt/jwt/v5"

type JWTToken struct {
	TokenType *string `json:"tokenType"`
	Body      *string `json:"body"`
	jwt.RegisteredClaims
}

type TokenRequest struct {
	Token string `json:"token"`
}
