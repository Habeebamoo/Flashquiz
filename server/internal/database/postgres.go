package database

import (
	"database/sql"
	"log"
	"os"
)

var DB *sql.DB

func Initialize() {
	var err error
	connStr := os.Getenv("DATABASE_URL")

	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Failed to initialize database connection")
	}

	DB.SetMaxOpenConns(1)

	if err := DB.Ping(); err != nil {
		log.Fatal("failed to connect to database", err)
	}
}