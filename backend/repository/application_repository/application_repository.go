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

func (r *ApplicationRepository) GetApplicationsByUserID(userID uint) ([]*models.Application, error) {
	if r.db == nil {
		return nil, errors.New("database connection is nil")
	}
	var applications []*models.Application
	result := r.db.Where("user_id = ?", userID).Find(&applications)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, gorm.ErrRecordNotFound
		}
		return nil, result.Error
	}

	return applications, nil
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
