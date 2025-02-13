package config

import (
	"errors"
	"log"
	"math/rand/v2"

	"github.com/R-Thibault/FollowMyJobs/backend/models"
	"github.com/jaswdr/faker"
	"gorm.io/gorm"
)

func SeedDatabaseWithApplications(db *gorm.DB) error {

	log.Println("Seeding the database for development...")
	// Initialize the faker generator
	fake := faker.New()
	// Find users with FirstName "John" and "Jane"
	var users []models.User
	if err := db.Where("email IN ?", []string{"johndoe@example.com", "janedoe@example.com"}).Find(&users).Error; err != nil {
		log.Fatalf("Failed to retrieve specific users: %v", err)
	}
	// If no users were found, log a message and return
	if len(users) == 0 {
		log.Println("No users found with FirstName 'John' or 'Jane'. Seeding skipped.")
		return errors.New("No users found with FirstName 'John' or 'Jane'. Seeding skipped.")
	}
	// Seed applications for each found user only if they have fewer than 10 applications
	for _, user := range users {
		var applicationCount int64
		// Count existing applications for the user
		if err := db.Model(&models.Application{}).Where("user_id = ?", user.ID).Count(&applicationCount).Error; err != nil {
			log.Printf("Failed to count applications for user %s: %v", user.Email, err)
			continue
		}

		// Only seed new applications if there are fewer than 10 existing applications
		if applicationCount < 40 {
			// Determine how many applications to add to reach 10
			numApplications := int(40 - applicationCount)
			for i := 0; i < numApplications; i++ {
				application := models.Application{
					UserID:      user.ID,
					StatusID:    uint(rand.IntN(4) + 1),
					Url:         fake.Internet().URL(),
					Title:       fake.Company().JobTitle(),
					Company:     fake.Company().Name(),
					Location:    fake.Address().City(),
					Description: fake.Lorem().Sentence(10),      // 10 words as a short description
					Salary:      fake.IntBetween(30000, 120000), // Random salary between 30k and 120k
					JobType:     fake.Lorem().Word(),            // Random word as job type
				}

				// Insert the application into the database
				if err := db.Create(&application).Error; err != nil {
					log.Printf("Error seeding application for user %s: %v\n", user.Email, err)
				} else {
					log.Printf("Seeded application for user %s: %s at %s\n", user.Email, application.Title, application.Company)
				}
			}
		} else {
			log.Printf("User %s already has 10 or more applications. Seeding skipped.", user.Email)
		}
	}
	log.Println("Database seeding completed.")
	return nil
}
