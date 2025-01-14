package statusrepository

import (
	"errors"

	"github.com/R-Thibault/FollowMyJobs/backend/models"
	"gorm.io/gorm"
)

type StatusRepository struct {
	db *gorm.DB
}

func NewStatusRepository(db *gorm.DB) *StatusRepository {
	return &StatusRepository{db: db}
}

func (r *StatusRepository) GetAllStatus() (*[]models.Status, error) {
	if r.db == nil {
		return nil, errors.New("database connection is nil")
	}
	var statuses []models.Status
	result := r.db.Find(&statuses)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, gorm.ErrRecordNotFound
		}
		return nil, result.Error
	}
	return &statuses, nil

}

func (r *StatusRepository) GetStatusByID(statusID uint) (*models.Status, error) {
	if r.db == nil {
		return nil, errors.New("database connection is nil")
	}
	var status models.Status
	result := r.db.Where("id = ?", statusID).First(&status)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, gorm.ErrRecordNotFound
		}
		return nil, result.Error
	}
	return &status, nil

}
