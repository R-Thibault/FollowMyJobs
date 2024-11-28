package applicationrepository

import (
	"errors"

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
	//Get TotalItems with a count before using limit/offset
	var totalItems int64
	r.db.Model(&models.Application{}).Where("user_id = ?", userID).Count(&totalItems)
	// Query to return applications with Limit/Offset
	var applications []*models.Application
	result := r.db
	result = result.Where("user_id = ?", userID)
	if requestSettings.Title != nil {
		result = result.Where("title LIKE ?", "%"+*requestSettings.Title+"%")
	}
	if requestSettings.Status.Applied != nil {
		result = result.Where("applied = ?", *requestSettings.Status.Applied)
	}
	if requestSettings.Status.Response != nil {
		result = result.Where("response = ?", *requestSettings.Status.Response)
	}
	if requestSettings.Status.FollowUp != nil {
		result = result.Where("follow_up = ?", *requestSettings.Status.FollowUp)
	}
	result = result.Order("created_at " + requestSettings.OrderByCreatedAt).Limit(requestSettings.Limit).Offset(requestSettings.OffSet).Find(&applications)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, 0, gorm.ErrRecordNotFound
		}
		return nil, 0, result.Error
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
