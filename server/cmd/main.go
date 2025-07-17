package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"flashquiz-server/internal/database"
	"flashquiz-server/internal/middlewares"
	"flashquiz-server/internal/routes"
	"github.com/joho/godotenv"
	"github.com/go-chi/httprate"
	_ "github.com/lib/pq"
)

func main() {
	godotenv.Load()
	database.Initialize()
	defer database.DB.Close()

	router := routes.SetUpRoutes()

	//rate limiter
	rateLimiter := httprate.LimitByIP(10, 1*time.Minute)

	handler := middlewares.CORS(middlewares.RequireAPIKey(middlewares.Recovery(middlewares.AuthMiddleware(rateLimiter(router)))))

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

	go func() {
		if err := srv.ListenAndServe(); err != nil && err == http.ErrServerClosed {
			log.Fatal("Server Error", err)
		}
	}()

	//Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server Failed to Shutdown %v\n", err)
	}

	log.Println("Server exited cleanly")
}
