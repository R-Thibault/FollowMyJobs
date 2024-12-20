package config

import (
	"errors"
	"log"

	utils "github.com/R-Thibault/FollowMyJobs/backend/internal/hash_util"
	"github.com/R-Thibault/FollowMyJobs/backend/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func SeedDatabaseWithUsers(db *gorm.DB) error {
	log.Println("Checking if seeding is necessary...")

	// Check if a user with the first name "John" already exists
	var existingUser models.User
	if err := db.Where("email = ?", "johndoe@example.com").First(&existingUser).Error; err == nil {
		log.Println("User 'John' already exists. Skipping seeding.")
		return nil
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		// If there is an error other than "record not found", return it
		log.Fatalf("Error checking for existing user: %v\n", err)
		return err
	}

	log.Println("Seeding the database with user data...")

	// Create an instance of HashingService
	hashingService := utils.NewHashingService()

	// Hash the password for the users
	hashedPassword, err := hashingService.HashPassword("superPassword1!")
	if err != nil {
		log.Fatalf("Error hashing password: %v\n", err)
		return errors.New("Error hashing password")
	}

	// Sample users to insert
	users := []models.User{
		{
			Email:          "johndoe@example.com",
			HashedPassword: hashedPassword,
			UserStatus:     "active",
			UserUUID:       uuid.New().String(),
			EmailIsValide:  true,
		},
		{
			Email:          "janedoe@example.com",
			HashedPassword: hashedPassword,
			UserStatus:     "active",
			UserUUID:       uuid.New().String(),
			EmailIsValide:  true,
		},
	}

	// Insert each user into the database
	for _, user := range users {
		if err := db.Create(&user).Error; err != nil {
			log.Printf("Error seeding user %s: %v\n", user.Email, err)
			return errors.New("Error seeding user")
		} else {
			log.Printf("Seeded user: %s\n", user.Email)
		}
	}

	log.Println("Database seeding completed.")
	return nil
}
