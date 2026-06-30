package database

import (
	"backend/models"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDatabase() {
	var err error

	if dsn := os.Getenv("DATABASE_URL"); dsn != "" {
		DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {
			log.Fatal("Failed to connect to Postgres: ", err)
		}
		log.Println("Connected to Postgres")
	} else {
		DB, err = gorm.Open(sqlite.Open("users.db"), &gorm.Config{})
		if err != nil {
			log.Fatal("Failed to connect to SQLite: ", err)
		}
		log.Println("Connected to SQLite (local dev)")
	}

	DB.AutoMigrate(
		&models.User{},
		&models.UserProfile{},
		&models.Project{},
		&models.Collaborator{},
		&models.Invitation{},
	)
}
