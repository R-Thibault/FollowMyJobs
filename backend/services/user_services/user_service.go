package services

import (
	"errors"
	"time"

	"github.com/R-Thibault/FollowMyJobs/backend/internal"
	hashingUtils "github.com/R-Thibault/FollowMyJobs/backend/internal/hash_util"
	"github.com/R-Thibault/FollowMyJobs/backend/models"
	otpRepository "github.com/R-Thibault/FollowMyJobs/backend/repository/otp_repository"
	userRepository "github.com/R-Thibault/FollowMyJobs/backend/repository/user_repository"
)

type UserService struct {
	UserRepo     userRepository.UserRepositoryInterface
	OTPRepo      otpRepository.OTPRepositoryInterface
	hashingUtils hashingUtils.HashingServiceInterface
}

func NewUserService(
	UserRepo userRepository.UserRepositoryInterface,
	OTPRepo otpRepository.OTPRepositoryInterface,
	hashingUtils hashingUtils.HashingServiceInterface) *UserService {
	return &UserService{
		UserRepo:     UserRepo,
		OTPRepo:      OTPRepo,
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

func (s *UserService) GetUserByID(userID uint) (*models.User, error) {
	return s.UserRepo.GetUserByID(userID)
}

func (s *UserService) GetUserByUUID(userUUID string) (*models.User, error) {
	return s.UserRepo.GetUserByUUID(userUUID)
}

func (s *UserService) UpdateUserPassword(existingUser models.User, updatedUserDatas models.UserPasswordUpdate) error {
	if updatedUserDatas.Email == "" {
		return errors.New("Email can't be empty")
	}
	if !internal.RegexPassword(updatedUserDatas.Password) {
		return errors.New("Password do not match requirement")
	}
	if updatedUserDatas.Password != updatedUserDatas.ConfirmPassword {
		return errors.New("Password confirmation do not match password")
	}
	passwordHashed, hashErr := s.hashingUtils.HashPassword(updatedUserDatas.Password)
	if hashErr != nil {
		return errors.New("Hashing process failed")
	}
	updatedUser := models.User{
		HashedPassword: passwordHashed,
	}
	return s.UserRepo.UpdateUser(existingUser.ID, updatedUser)
}

func (s *UserService) ResetPassword(user models.User, claims models.JWTToken, newPassword string) error {
	if *claims.TokenType != "resetPassword" {
		return errors.New("TokenType not good")
	}
	if *claims.Body == "" {
		return errors.New("empty body")
	}
	otpType := "resetPassword"
	otpCode := *claims.Body
	// Fetch OTP associated with the user
	otpSaved, err := s.OTPRepo.GetOTPCodeByUserIDandType(user.ID, otpType)
	if err != nil || otpSaved == nil {
		return errors.New("OTP not found")
	}

	// Verify OTP
	if otpSaved.OtpCode == otpCode {
		if otpSaved.OtpExpiration.After(time.Now()) {
			// Hash newpassword
			passwordHashed, hashErr := s.hashingUtils.HashPassword(newPassword)
			if hashErr != nil {
				return errors.New("Hashing process failed")
			}
			updateErr := s.UserRepo.UpdateUserPassword(user.ID, passwordHashed)
			if updateErr != nil {
				return errors.New("Update user failed")
			}
			return nil
		} else {
			return errors.New("OTP expired")
		}
	} else {
		return errors.New("OTP codes do not match")
	}

}

func (s *UserService) UpdateUserProfile(existingUser models.User, updatedUserDatas models.UserProfileUpdate) error {
	if updatedUserDatas.Email == "" {
		return errors.New("Email can't be empty")
	}

	updatedUser := models.User{
		Email:     updatedUserDatas.Email,
		FirstName: updatedUserDatas.FirstName,
		LastName:  updatedUserDatas.LastName,
	}
	return s.UserRepo.UpdateUser(existingUser.ID, updatedUser)
}
