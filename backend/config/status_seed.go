package config

import (
	"log"

	"github.com/R-Thibault/FollowMyJobs/backend/models"
	"gorm.io/gorm"
)

func SeedDatabaseWithStatus(db *gorm.DB) error {
	log.Println("Seeding the database status for development...")

	// Find users with FirstName "John" and "Jane"
	var users []models.User
	if err := db.Where("email IN ?", []string{"johndoe@example.com", "janedoe@example.com"}).Find(&users).Error; err != nil {
		log.Fatalf("Failed to retrieve specific users: %v", err)
	}

	statusList := []string{"Applied", "Followed Up", "Closed", "Rejected"}

	for _, status := range statusList {
		statusObject := models.Status{
			Status: status,
		}

		if err := db.Create(&statusObject).Error; err != nil {
			log.Printf("Error seeding status: %v", err)
		} else {
			log.Printf("Status seeded successfully")
		}
	}
	log.Println("Status seeding completed.")
	return nil
}
