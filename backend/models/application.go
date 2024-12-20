package models

import "gorm.io/gorm"

// Application table for database

type Application struct {
	gorm.Model
	UserID      uint
	Url         string `gorm:"not null"`
	Title       string `gorm:"size:255; not null"`
	Company     string `gorm:"size:255"`
	Location    string `gorm:"size:255"`
	Description string
	Salary      string `gorm:"size:255"`
	JobType     string `gorm:"size:255"`
	Applied     bool   `gorm:"default:true"`
	Response    bool   `gorm:"default:false"`
	FollowUp    bool   `gorm:"default:false"`
}

type ApplicationStatusRequest struct {
	ID       uint `json:"appID"`
	Applied  bool `json:"applied"`
	Response bool `json:"response"`
	FollowUp bool `json:"followUp"`
}
