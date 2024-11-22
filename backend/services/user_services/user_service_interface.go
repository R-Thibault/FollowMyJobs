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
}