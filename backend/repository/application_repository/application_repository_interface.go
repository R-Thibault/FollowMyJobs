package applicationrepository

import "github.com/R-Thibault/FollowMyJobs/backend/models"

type ApplicationRepositoryInterface interface {
	// SaveApplication saves a new application to the repository.
	// Returns an error if the operation fails.
	SaveApplication(appDatas models.Application) error

	// UpdateApplication updates an existing application in the repository.
	// Returns the updated application and an error if the operation fails.
	UpdateApplication(appDatas models.Application) (*models.Application, error)

	// GetApplicationByID retrieves an application by its ID from the repository.
	// Returns the application and an error if the operation fails.
	GetApplicationByID(applicationID uint) (*models.Application, error)

	// GetApplicationsByUserID retrieves all applications associated with a user ID from the repository.
	// Returns a slice of applications and an error if the operation fails.
	GetApplicationsByUserID(userID uint) ([]*models.Application, error)

	// DeleteApplication removes an application from the repository.
	// Returns an error if the operation fails.
	DeleteApplication(application models.Application) error

	// UpdateApplicationStatus updates the status of an existing application in the repository.
	// Returns an error if the operation fails.
	UpdateApplicationStatus(application models.Application) error
}
