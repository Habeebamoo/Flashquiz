package handlers

import (
	"database/sql"
	"encoding/json"
	"flashquiz-server/internal/database"
	"flashquiz-server/internal/middlewares"
	"flashquiz-server/internal/models"
	"flashquiz-server/internal/service"
	"net/http"
	"time"
)

var (
	JsonResponse          = service.JsonResponse
	ErrorResponse         = service.ErrorResponse
	Hash                  = service.Hash
	ResendVerification    = service.ResendVerification
	GenerateToken         = service.GenerateToken
	SendPasswordResetLink = service.SendPasswordResetLink
)

func GetUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != "GET" {
		ErrorResponse(w, http.StatusMethodNotAllowed, "Method Not Allowed")
		return
	}

	userId, ok := r.Context().Value(middlewares.UserIdKey).(string)
	if !ok {
		ErrorResponse(w, http.StatusUnauthorized, "Unauthorized Access")
		return
	}

	var user models.UserResponse
	err := database.DB.QueryRow("SELECT users.user_id, users.name, users.email, users.is_verified, records.quiz_completed, records.avg_score, records.rank, records.points FROM users JOIN records ON users.user_id = records.user_id WHERE users.user_id = $1", userId).Scan(&user.UserId, &user.Name, &user.Email, &user.IsVerified, &user.QuizCompleted, &user.AverageScore, &user.Rank, &user.TotalPoints)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Internal Server Error")
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]models.UserResponse{"data": user})
}

func VerifyUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != "POST" {
		ErrorResponse(w, http.StatusMethodNotAllowed, "Method Not Allowed")
		return
	}

	//extract token
	token := r.URL.Query().Get("token")
	if token == "" {
		ErrorResponse(w, http.StatusBadRequest, "Token Missing")
		return
	}

	var userId string
	var expiresAt time.Time

	//Checks for the token associated with the user
	err := database.DB.QueryRow("SELECT user_id, expires_at FROM tokens WHERE token = $1", token).Scan(&userId, &expiresAt)
	if err != nil {
		if err == sql.ErrNoRows {
			ErrorResponse(w, http.StatusBadRequest, "Invalid Token")
			return
		}
		ErrorResponse(w, http.StatusInternalServerError, "Internal Server Error")
		return
	}

	//checks the expiriry
	if time.Now().After(expiresAt) {
		ErrorResponse(w, http.StatusRequestTimeout, "Expired Token")
		return
	}

	//verify the user email
	_, err = database.DB.Exec("UPDATE users SET is_verified = TRUE WHERE user_id = $1", userId)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Internal Server Error")
		return
	}

	//delete the token
	_, err = database.DB.Exec("DELETE FROM tokens WHERE user_id = $1", userId)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Internal Server Error")
		return
	}

	JsonResponse(w, http.StatusOK, "Email Verification Successful")
}

func ResendEmailVerification(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != "POST" {
		ErrorResponse(w, http.StatusMethodNotAllowed, "Method Not Allowed")
		return
	}

	user := &models.User{}
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		ErrorResponse(w, http.StatusBadRequest, "Invalid JSON Format")
		return
	}

	if err := user.IdValidate(); err != nil {
		ErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	token, err := GenerateToken()
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Internal Server Error")
		return
	}

	//gets the details of the user
	var name string
	var email string
	var isVerified bool
	var userId string

	err = database.DB.QueryRow("SELECT name, email, is_verified, user_id FROM users WHERE user_id = $1", user.UserId).Scan(&name, &email, &isVerified, &userId)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Internal Server Error")
		return
	}

	if isVerified {
		JsonResponse(w, http.StatusOK, "Your account is already verified")
		return
	}

	//save the token ad user in tokens table
	_, err = database.DB.Exec("INSERT INTO tokens (user_id, token, expires_at) VALUES ($1, $2, $3)", userId, token, time.Now().Add(24*time.Hour))
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Internal Server Error")
		return
	}

	//sends email message
	go ResendVerification(email, name, token)
	JsonResponse(w, http.StatusOK, "Verification Email Sent")
}

func ForgotPassword(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != "POST" {
		ErrorResponse(w, http.StatusMethodNotAllowed, "Method Not Allowed")
		return
	}

	//validates request
	user := &models.User{}
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		ErrorResponse(w, http.StatusBadRequest, "Invalid JSON Format")
		return
	}

	if err := user.EmailValidate(); err != nil {
		ErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	token, err := GenerateToken()
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Internal Server Error")
		return
	}

	//gets the details of the user (by the email)

	var name string
	var userId string

	err = database.DB.QueryRow("SELECT name, user_id FROM users WHERE email = $1", user.Email).Scan(&name, &userId)
	if err != nil {
		if err == sql.ErrNoRows {
			JsonResponse(w, http.StatusOK, "You will receive a reset link if the email is regisered")
			return
		}
		ErrorResponse(w, http.StatusInternalServerError, "Internal Server Error")
		return
	}

	//adds the token to the database
	_, err = database.DB.Exec("INSERT INTO tokens (user_id, token, expires_at) VALUES ($1, $2, $3)", userId, token, time.Now().Add(24*time.Hour))
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Internal Server Error")
		return
	}

	go SendPasswordResetLink(user.Email, name, token)
	JsonResponse(w, http.StatusOK, "You will receive a reset link if the email is regisered")
}

func ResetPassword(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != "PUT" {
		ErrorResponse(w, http.StatusMethodNotAllowed, "Method Not Allowed")
		return
	}

	//extract token
	token := r.URL.Query().Get("token")
	if token == "" {
		ErrorResponse(w, http.StatusBadRequest, "Token Missing")
		return
	}

	var userId string

	//Checks for the token associated with the user
	err := database.DB.QueryRow("SELECT user_id FROM tokens WHERE token = $1", token).Scan(&userId)
	if err != nil {
		if err == sql.ErrNoRows {
			ErrorResponse(w, http.StatusBadRequest, "Invalid Token")
			return
		}
		ErrorResponse(w, http.StatusInternalServerError, "Internal Server Error")
		return
	}

	//decodes and validates the form password
	user := &models.User{}
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		ErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	if err := user.PasswordValidate(); err != nil {
		ErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	//update the users password
	newHashedPassword, _ := Hash(user.Password)
	_, err = database.DB.Exec("UPDATE users SET password = $1 WHERE user_id = $2", newHashedPassword, userId)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Internal Server Error")
	}

	//delete the token
	_, err = database.DB.Exec("DELETE FROM tokens WHERE user_id = $1", userId)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Internal Server Error")
		return
	}

	JsonResponse(w, http.StatusOK, "Password Updated Successfully")
}
