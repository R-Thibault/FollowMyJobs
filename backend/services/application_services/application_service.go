package applicationservices

import (
	"errors"
	"log"

	"github.com/R-Thibault/FollowMyJobs/backend/models"
	applicationrepository "github.com/R-Thibault/FollowMyJobs/backend/repository/application_repository"
	statusrepository "github.com/R-Thibault/FollowMyJobs/backend/repository/status_repository"
)

type ApplicationService struct {
	ApplicationRepo applicationrepository.ApplicationRepositoryInterface
	StatusRepo      statusrepository.StatusRepositoryInterface
}

func NewApplicationService(
	ApplicationRepo applicationrepository.ApplicationRepositoryInterface,
	StatusRepo statusrepository.StatusRepositoryInterface) *ApplicationService {
	return &ApplicationService{ApplicationRepo: ApplicationRepo, StatusRepo: StatusRepo}
}

func (s *ApplicationService) SaveApplication(userID uint, appData models.Application) error {
	if appData.Title == "" {
		return errors.New("Title can't be empty")
	}
	appData.UserID = userID

	return s.ApplicationRepo.SaveApplication(appData)
}

func (s *ApplicationService) UpdateApplication(userID uint, appData models.Application) (*models.Application, error) {
	if appData.UserID != userID {
		return &models.Application{}, errors.New("The application doesn't belong to this user")
	}
	return s.ApplicationRepo.UpdateApplication(appData)
}

func (s *ApplicationService) GetApplicationByID(userID uint, applicationID uint) (*models.Application, error) {
	if userID == 0 || applicationID == 0 {
		return &models.Application{}, errors.New("userID or ApplicationID can't be null")
	}
	application, err := s.ApplicationRepo.GetApplicationByID(applicationID)
	if err != nil || application == nil {
		return &models.Application{}, errors.New("Can't find application")
	}
	if application.UserID != userID {
		return &models.Application{}, errors.New("Application not created by user")
	}
	return application, nil
}

func (s *ApplicationService) GetApplicationsByUserID(userID uint, requestSettings models.RequestSettings) ([]*models.Application, int64, error) {
	if userID == 0 {
		return nil, 0, errors.New("userID or ApplicationID can't be null")
	}

	applications, totalItems, err := s.ApplicationRepo.GetApplicationsByUserID(userID, requestSettings)
	if err != nil {
		log.Printf("Service err: %v", err)
		return nil, 0, errors.New("Can't find applications with this userID")
	}
	return applications, totalItems, nil
}

func (s *ApplicationService) DeleteApplication(userID uint, applicationID uint) error {
	if userID == 0 || applicationID == 0 {
		return errors.New("UserID or ApplicationID can't be null")
	}
	application, err := s.ApplicationRepo.GetApplicationByID(applicationID)
	if err != nil || application == nil {
		return errors.New("Can't find application")
	}
	if application.UserID != userID {
		return errors.New("Application not created by user")
	}
	deleteErr := s.ApplicationRepo.DeleteApplication(*application)
	if deleteErr != nil {
		return errors.New("Error during supression process")
	}
	return nil
}

func (s *ApplicationService) UpdateApplicationStatus(userID uint, applicationDatas models.ApplicationStatusRequest) error {
	if userID == 0 || applicationDatas.ApplicationID == 0 {
		return errors.New("UserID or ApplicationID can't be null")
	}
	application, err := s.ApplicationRepo.GetApplicationByID(applicationDatas.ApplicationID)
	if err != nil || application == nil {
		return errors.New("Can't find application")
	}
	if application.UserID != userID {
		return errors.New("Application not created by user")
	}
	newStatus, err := s.StatusRepo.GetStatusByID(applicationDatas.StatusID)
	if err != nil {
		return errors.New("Can't find status")
	}
	application.StatusID = newStatus.ID
	statusErr := s.ApplicationRepo.UpdateApplicationStatus(*application)
	if statusErr != nil {
		return errors.New("Error during status update")
	}
	return nil
}
