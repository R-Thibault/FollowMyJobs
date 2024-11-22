package repository

import "github.com/R-Thibault/FollowMyJobs/backend/models"

type UserRepositoryInterface interface {
	// SaveUser saves a user to the repository.
	// Returns an error if the user could not be saved.
	SaveUser(user models.User) error

	// GetUserByEmail retrieves a user by their email address.
	// Returns a pointer to the User model and an error if any.
	GetUserByEmail(email string) (*models.User, error)

	// ValidateEmail checks if the provided email is valid.
	// Returns an error if the email is invalid.
	ValidateEmail(email string) error

	// GetUserByUUID retrieves a user by their UUID.
	// Returns a pointer to the User model and an error if any.
	GetUserByUUID(uuid string) (*models.User, error)

	// GetUserByID retrieves a user by their ID.
	// Returns a pointer to the User model and an error if any.
	GetUserByID(ID uint) (*models.User, error)
}