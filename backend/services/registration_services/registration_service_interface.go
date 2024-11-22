package registrationservices

import "github.com/R-Thibault/FollowMyJobs/backend/models"

type RegistrationServiceInterface interface {
	// UserRegistration registers a new user with the provided credentials.
	// It returns an error if the registration fails.
	UserRegistration(creds models.Credentials) error
}
