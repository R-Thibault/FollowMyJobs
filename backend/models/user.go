package models

import "gorm.io/gorm"

// User table for Database
type User struct {
	gorm.Model
	Email          string `gorm:"size:255;unique;index;not null"`
	FirstName      string `gorm:"size:255;"`
	LastName       string `gorm:"size:255;"`
	HashedPassword string `gorm:"size:255;"`
	UserStatus     string `gorm:"size:255; not null"`
	UserUUID       string `gorm:"size:36;index;unique;not null"`
	EmailIsValide  bool   `gorm:"default:false"`
	Otps           []OTP
	Applications   []Application `gorm:"foreignkey:UserID"`
}

type UserPasswordUpdate struct {
	Email           string `json:"email"`
	Password        string `json:"password"`
	ConfirmPassword string `json:"confirmPassword"`
}

type UserProfileUpdate struct {
	Email     string `json:"email"`
	LastName  string `json:"lastname"`
	FirstName string `json:"firstname"`
}
