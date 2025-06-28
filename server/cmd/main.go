package main

import (
	"flashquiz-server/internal/middlewares"
	"flashquiz-server/internal/handlers"
	"flashquiz-server/internal/database"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file, ok in prod")
	}
	
	database.Initialize()
	defer database.DB.Close()

	router := http.NewServeMux()

	//auth routes
	router.HandleFunc("/api/auth/register", handlers.Register)
	router.HandleFunc("/api/auth/login", handlers.Login)

	//user routes
	router.HandleFunc("/api/user/me", handlers.GetUser)
	router.HandleFunc("/api/user/verify", handlers.VerifyUser)
	router.HandleFunc("/api/user/resend-verification", handlers.ResendEmailVerification)
	router.HandleFunc("/api/user/forgot-password", handlers.ForgotPassword)
	router.HandleFunc("/api/user/reset-password", handlers.ResetPassword)

	handler := middlewares.CORS(middlewares.Recovery(middlewares.AuthMiddleware(router)))

	PORT := os.Getenv("PORT")
	if PORT == "" {
		PORT = "8080"
	}

	srv := &http.Server{
		Addr: ":"+PORT,
		Handler: handler,
		ReadTimeout: 5*time.Second,
		WriteTimeout: 10*time.Second,
		IdleTimeout: 15*time.Second,
	}

	log.Println("Connected to Postgres")
	log.Printf("Server running on port %s\n", PORT)
	log.Fatal(srv.ListenAndServe())
}