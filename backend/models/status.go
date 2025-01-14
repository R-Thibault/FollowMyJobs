package models

import "gorm.io/gorm"

type Status struct {
	gorm.Model
	Status       string        `gorm:"size:255; not null"`
	Applications []Application `gorm:"foreignkey:StatusID"`
}
