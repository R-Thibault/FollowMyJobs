package applicationrepository

import (
	"errors"
	"fmt"
	"log"

	"github.com/R-Thibault/FollowMyJobs/backend/models"
	"gorm.io/gorm"
)

type ApplicationRepository struct {
	db *gorm.DB
}

func NewApplicationRepository(db *gorm.DB) *ApplicationRepository {
	return &ApplicationRepository{db: db}
}

func (r *ApplicationRepository) SaveApplication(appDatas models.Application) error {
	if r.db == nil {
		return errors.New("database connection is nil")
	}
	return r.db.Create(&appDatas).Error

}

func (r *ApplicationRepository) UpdateApplication(appDatas models.Application) (*models.Application, error) {
	if r.db == nil {
		return nil, errors.New("database connection is nil")
	}
	result := r.db.Model(&models.Application{}).Where("id = ?", appDatas.ID).Updates(appDatas)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, gorm.ErrRecordNotFound
		}
		return nil, result.Error
	}
	return &appDatas, nil
}

func (r *ApplicationRepository) GetApplicationByID(applicationID uint) (*models.Application, error) {
	if r.db == nil {
		return nil, errors.New("database connection is nil")
	}
	var application models.Application
	result := r.db.Where("id = ?", applicationID).First(&application)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, gorm.ErrRecordNotFound
		}
		return nil, result.Error
	}
	return &application, nil
}

func (r *ApplicationRepository) GetApplicationsByUserID(userID uint, requestSettings models.RequestSettings) ([]*models.Application, int64, error) {
	if r.db == nil {
		return nil, 0, errors.New("database connection is nil")
	}

	var totalItems int64
	var applications []*models.Application

	// Count total applications (without limit/offset)
	if err := r.db.Model(&models.Application{}).
		Where("user_id = ?", userID).
		Count(&totalItems).Error; err != nil {
		return nil, 0, fmt.Errorf("error counting applications: %w", err)
	}

	// Apply filters and pagination for the data query
	query := r.db.Preload("Status").Model(&models.Application{}).
		Where("user_id = ?", userID)

	// Optional Title Filtering
	if requestSettings.Title != nil {
		query = query.Where("LOWER(title) LIKE ?", "%"+*requestSettings.Title+"%")
	}
	if len(requestSettings.Status) > 0 {
		query = query.Where("status_id IN (?)", requestSettings.Status)
	}
	// Apply Sorting with basic validation
	if requestSettings.SortBy != "" && requestSettings.SortOrder != "" {

		query = query.Order(fmt.Sprintf("%s %s", requestSettings.SortBy, requestSettings.SortOrder))
	} else {
		log.Printf("Repo err: %v", requestSettings.SortBy)
		return nil, 0, errors.New("invalid sort field specified")
	}

	// Apply Limit and Offset for pagination
	query = query.Limit(requestSettings.Limit).Offset(requestSettings.OffSet)

	// Fetch the results
	if err := query.Find(&applications).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, 0, gorm.ErrRecordNotFound
		}
		return nil, 0, fmt.Errorf("error fetching applications: %w", err)
	}

	return applications, totalItems, nil
}

func (r *ApplicationRepository) DeleteApplication(application models.Application) error {
	if r.db == nil {
		return errors.New("database connection is nil")
	}
	result := r.db.Delete(&application)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return gorm.ErrRecordNotFound
		}
		return result.Error
	}

	return nil
}

func (r *ApplicationRepository) UpdateApplicationStatus(application models.Application) error {
	if r.db == nil {
		return errors.New("database connection is nil")
	}
	result := r.db.Model(&models.Application{}).Where("id = ?", application.ID).Updates(application)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return gorm.ErrRecordNotFound
		}
		return result.Error
	}
	return nil
}
