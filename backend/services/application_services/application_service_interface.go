package applicationservices

import "github.com/R-Thibault/FollowMyJobs/backend/models"

type ApplicationServiceInterface interface {
	// SaveApplication saves a new application for a user.
	// Parameters:
	// - userID: the ID of the user.
	// - appData: the application data to be saved.
	// Returns:
	// - error: an error if the operation fails, otherwise nil.
	SaveApplication(userID uint, appData models.Application) error

	// UpdateApplication updates an existing application for a user.
	// Parameters:
	// - userID: the ID of the user.
	// - appData: the updated application data.
	// Returns:
	// - *models.Application: the updated application.
	// - error: an error if the operation fails, otherwise nil.
	UpdateApplication(userID uint, appData models.Application) (*models.Application, error)

	// GetApplicationByID retrieves an application by its ID for a user.
	// Parameters:
	// - userID: the ID of the user.
	// - applicationID: the ID of the application to be retrieved.
	// Returns:
	// - *models.Application: the application data.
	// - error: an error if the operation fails, otherwise nil.
	GetApplicationByID(userID uint, applicationID uint) (*models.Application, error)

	// GetApplicationsByUserID retrieves all applications for a user.
	// Parameters:
	// - userID: the ID of the user.
	// Returns:
	// - []*models.Application: a slice of applications.
	// - error: an error if the operation fails, otherwise nil.
	GetApplicationsByUserID(userID uint, requestSettings models.RequestSettings) ([]*models.Application, int64, error)

	// DeleteApplication deletes an application by its ID for a user.
	// Parameters:
	// - userID: the ID of the user.
	// - applicationID: the ID of the application to be deleted.
	// Returns:
	// - error: an error if the operation fails, otherwise nil.
	DeleteApplication(userID uint, applicationID uint) error

	// UpdateApplicationStatus updates the status of an application for a user.
	// Parameters:
	// - userID: the ID of the user.
	// - applicationDatas: the request data containing the new status.
	// Returns:
	// - error: an error if the operation fails, otherwise nil.
	UpdateApplicationStatus(userID uint, applicationDatas models.ApplicationStatusRequest) error
}
