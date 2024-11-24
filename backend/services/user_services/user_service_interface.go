package services

import "github.com/R-Thibault/FollowMyJobs/backend/models"

type UserServiceInterface interface {
	// GetUserByEmail retrieves a user by their email address.
	// It returns a pointer to the User model and an error if any occurs.
	// Parameters:
	// - email: The email address of the user to retrieve.
	// Returns:
	// - *models.User: A pointer to the User model if found.
	// - error: An error if the user could not be retrieved.
	GetUserByEmail(email string) (*models.User, error)

	// EmailValidation validates the given email address.
	// It returns an error if the email address is not valid.
	// Parameters:
	// - email: The email address to validate.
	// Returns:
	// - error: An error if the email address is not valid.
	EmailValidation(email string) error

	// GetUserByID retrieves a user by their unique ID.
	// It returns a pointer to the User model and an error if any occurs.
	// Parameters:
	// - userID: The unique ID of the user to retrieve.
	// Returns:
	// - *models.User: A pointer to the User model if found.
	// - error: An error if the user could not be retrieved.
	GetUserByID(userID uint) (*models.User, error)

	// ResetPassword resets the password for a given user.
	// It returns an error if the password could not be reset.
	// Parameters:
	// - user: The user whose password is to be reset.
	// - claims: The JWT token claims associated with the user.
	// - newPassword: The new password to set for the user.
	// Returns:
	// - error: An error if the password could not be reset.
	ResetPassword(user models.User, claims models.JWTToken, newPassword string) error
}
