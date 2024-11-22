package services

import (
	hashingUtils "github.com/R-Thibault/FollowMyJobs/backend/internal/hash_util"
	"github.com/R-Thibault/FollowMyJobs/backend/models"
	userRepository "github.com/R-Thibault/FollowMyJobs/backend/repository/user_repository"
)

type UserService struct {
	UserRepo     userRepository.UserRepositoryInterface
	hashingUtils hashingUtils.HashingServiceInterface
}

func NewUserService(
	UserRepo userRepository.UserRepositoryInterface,
	hashingUtils hashingUtils.HashingServiceInterface) *UserService {
	return &UserService{
		UserRepo:     UserRepo,
		hashingUtils: hashingUtils,
	}
}

var _ UserServiceInterface = &UserService{}

func (s *UserService) GetUserByEmail(email string) (*models.User, error) {
	return s.UserRepo.GetUserByEmail(email)
}

func (s *UserService) EmailValidation(email string) error {
	return s.UserRepo.ValidateEmail(email)
}
