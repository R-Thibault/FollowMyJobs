package models

import "gorm.io/gorm"

// Application table for database

type Application struct {
	gorm.Model
	UserID      uint
	StatusID    uint
	Status      Status `gorm:"foreignKey:StatusID"`
	Url         string `gorm:"not null"`
	Title       string `gorm:"size:255; not null"`
	Company     string `gorm:"size:255"`
	Location    string `gorm:"size:255"`
	Description string
	Salary      int
	JobType     string `gorm:"size:255"`
}

type ApplicationStatusRequest struct {
	ID          uint `json:"appID"`
	NewStatusID uint `json:"newStatusID"`
}
