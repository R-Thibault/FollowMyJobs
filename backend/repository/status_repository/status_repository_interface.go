package statusrepository

import "github.com/R-Thibault/FollowMyJobs/backend/models"

type StatusRepositoryInterface interface {

	// GetStatusByID retrieves all statuses from the repository.
	// Returns all statuses and an error if the operation fails.
	GetAllStatus() (*[]models.Status, error)

	// GetStatusByID retrieves a status by its ID from the repository.
	// Returns the status and an error if the operation fails.
	GetStatusByID(statusID uint) (*models.Status, error)
}
