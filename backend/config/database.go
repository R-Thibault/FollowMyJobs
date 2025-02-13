package config

import (
	"fmt"
	"log"

	"github.com/R-Thibault/FollowMyJobs/backend/models"
	_ "github.com/lib/pq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	host := GetConfig("POSTGRES_HOST")
	user := GetConfig("POSTGRES_USER")
	password := GetConfig("POSTGRES_PASSWORD")
	dbName := GetConfig("POSTGRES_DB")
	port := GetConfig("POSTGRES_PORT")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable", host, user, password, dbName, port)
	var err error

	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {

		log.Fatalf("Failed to connect to the database: %v", err)
	}

	log.Println("Connected to the database successfully!")

	if err := DB.AutoMigrate(&models.User{}, &models.OTP{}, &models.Status{}, &models.Application{}); err != nil {
		log.Fatalf("Failed to migrate the database schema: %v", err)
	}
	log.Println("Database schema migrated successfully!")
}

// GetDB returns the database connection instance
func GetDB() *gorm.DB {
	return DB
}

func CloseDB() {
	if sqlDB, err := DB.DB(); err == nil {
		if err := sqlDB.Close(); err != nil {
			log.Printf("Error closing the database connection: %v", err)
		} else {
			log.Println("Database connection closed.")
		}
	} else {
		log.Printf("Error retrieving the generic database object: %v", err)
	}
}
