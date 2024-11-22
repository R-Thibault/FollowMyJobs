package repository

import "github.com/R-Thibault/FollowMyJobs/backend/models"

// UserRepositoryInterface defines the methods for interacting with users in the database.
// UserRepositoryInterface defines the methods that any
// implementation of a user repository should provide.
type UserRepositoryInterface interface {
	// GetUserByEmail retrieves a user by their email address.
	// Returns a pointer to the User model and an error if any.
	GetUserByEmail(email string) (*models.User, error)

	// ValidateEmail checks if the provided email is valid.
	// Returns an error if the email is invalid.
	ValidateEmail(email string) error

	// GetUserByUUID retrieves a user by their UUID.
	// Returns a pointer to the User model and an error if any.
	GetUserByUUID(uuid string) (*models.User, error)
}
