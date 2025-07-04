package routes

import (
	"flashquiz-server/internal/handlers"
	"net/http"
)

func SetUpRoutes() *http.ServeMux {
	r := http.NewServeMux()

	//auth routes
	r.HandleFunc("/api/auth/register", handlers.Register)
	r.HandleFunc("/api/auth/login", handlers.Login)

	//user routes
	r.HandleFunc("/api/user/me", handlers.GetUser)
	r.HandleFunc("/api/user/verify", handlers.VerifyUser)
	r.HandleFunc("/api/user/resend-verification", handlers.ResendEmailVerification)
	r.HandleFunc("/api/user/forgot-password", handlers.ForgotPassword)
	r.HandleFunc("/api/user/reset-password", handlers.ResetPassword)

	//quiz routes
	r.HandleFunc("/api/quiz", handlers.FetchQuiz)
	r.HandleFunc("/api/quiz/upload", handlers.UploadQuiz)

	return r
}