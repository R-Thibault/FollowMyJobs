package models

// Credentials struct, for SignIn - SignUp - auth_middleware
type Credentials struct {
	Email           string `json:"email"`
	FirstName       string `json:"firstname"`
	LastName        string `json:"lastname"`
	Password        string `json:"password"`
	ConfirmPassword string `json:"confirmPassword"`
}

type ResetPasswordCredentials struct {
	Email           string `json:"email"`
	Password        string `json:"password"`
	ConfirmPassword string `json:"confirmPassword"`
	TokenString     string `json:"tokenString"`
}

type ResetPasswordMail struct {
	Email string `json:"email"`
}
