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
	ErrorResponse = service.ErrorResponse
	Hash = service.Hash
	ResendVerification = service.ResendVerification
	GenerateToken = service.GenerateToken
	SendPasswordResetLink = service.SendPasswordResetLink
)

func GetUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != "GET" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		ErrorResponse(w, "Method Not Allowed")
		return
	}

	userId, ok := r.Context().Value(middlewares.UserIdKey).(string)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		ErrorResponse(w, "Unauthorized Access")
		return
	}

	var user models.UserResponse
	err := database.DB.QueryRow("SELECT user_id, name, email, is_verified FROM users WHERE user_id = $1", userId).Scan(&user.UserId, &user.Name, &user.Email, &user.IsVerified)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		ErrorResponse(w, "Internal Server Error")
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]models.UserResponse{"data": user})
}

func VerifyUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		ErrorResponse(w, "Method Not Allowed")
		return
	}

	//extract token
	token := r.URL.Query().Get("token")
	if token == "" {
		w.WriteHeader(http.StatusBadRequest)
		ErrorResponse(w, "Token Missing")
		return
	}

	var userId string
	var expiresAt time.Time

	//Checks for the token associated with the user
	err := database.DB.QueryRow("SELECT user_id, expires_at FROM tokens WHERE token = $1", token).Scan(&userId, &expiresAt)
	if err != nil {
		if err == sql.ErrNoRows {
			w.WriteHeader(http.StatusBadRequest)
			ErrorResponse(w, "Invalid Token")
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		ErrorResponse(w, "Internal Server Error")
		return
	}

	//checks the expiriry
	if time.Now().After(expiresAt) {
		w.WriteHeader(http.StatusRequestTimeout)
		ErrorResponse(w, "Expired Token")
		return
	}

	//verify the user email
	_, err = database.DB.Exec("UPDATE users SET is_verified = TRUE WHERE user_id = $1", userId)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		ErrorResponse(w, "Internal Server Error")
		return
	}

	//delete the token
	_, err = database.DB.Exec("DELETE FROM tokens WHERE user_id = $1", userId)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		ErrorResponse(w, "Internal Server Error")
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Email Verification Successful"})
}

func ResendEmailVerification(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		ErrorResponse(w, "Method Not Allowed")
		return
	}

	user := &models.User{}
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		ErrorResponse(w, "Invalid JSON Format")
		return
	}

	if err := user.IdValidate(); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		ErrorResponse(w, err.Error())
		return
	}

	token, err := GenerateToken()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		ErrorResponse(w, "Internal Server Error")
		return
	}

	//gets the details of the user
	var name string
	var email string
	var isVerified bool
	var userId string

	err = database.DB.QueryRow("SELECT name, email, is_verified, user_id FROM users WHERE user_id = $1", user.UserId).Scan(&name, &email, &isVerified, &userId)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		ErrorResponse(w, "Internal Server Error")
		return
	}

	if isVerified {
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"message": "Your account is already verified"})
		return
	}

	//save the token ad user in tokens table
	_, err = database.DB.Exec("INSERT INTO tokens (user_id, token, expires_at) VALUES ($1, $2, $3)", userId, token, time.Now().Add(24*time.Hour))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		ErrorResponse(w, "Internal Server Error")
		return		
	}

	//sends email message
	go ResendVerification(email, name, token)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Verification Link Sent"})
}

func ForgotPassword(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		ErrorResponse(w, "Method Not Allowed")
		return
	}

	//validates request
	user := &models.User{}
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		ErrorResponse(w, "Invalid JSON Format")
		return	
	}

	if err := user.EmailValidate(); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		ErrorResponse(w, err.Error())
		return
	}

	token, err := GenerateToken()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		ErrorResponse(w, "Internal Server Error")
		return
	}

	//gets the details of the user (by the email)

	var name string
	var userId string

	err = database.DB.QueryRow("SELECT name, user_id FROM users WHERE email = $1", user.Email).Scan(&name, &userId)
	if err != nil {
		if err == sql.ErrNoRows {
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(map[string]string{"message": "You will receive a reset link if the email is regisered"})
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		ErrorResponse(w, "Internal Server Error")
		return
	}

	//adds the token to the database
	_, err = database.DB.Exec("INSERT INTO tokens (user_id, token, expires_at) VALUES ($1, $2)", userId, token, time.Now().Add(24*time.Hour))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		ErrorResponse(w, "Internal Server Error")
		return
	}

	go SendPasswordResetLink(user.Email, name, token)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "You will receive a reset link if the email is regisered"})
}

func ResetPassword(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != "PUT" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		ErrorResponse(w, "Method Not Allowed")
		return
	}

	//extract token
	token := r.URL.Query().Get("token")
	if token == "" {
		w.WriteHeader(http.StatusBadRequest)
		ErrorResponse(w, "Token Missing")
		return
	}

	var userId string
	
	//Checks for the token associated with the user
	err := database.DB.QueryRow("SELECT user_id FROM tokens WHERE token = $1", token).Scan(&userId)
	if err != nil {
		if err == sql.ErrNoRows {
			w.WriteHeader(http.StatusBadRequest)
			ErrorResponse(w, "Invalid Token")
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		ErrorResponse(w, "Internal Server Error")
		return
	}

	//decodes and validates the form password
	user := &models.User{}
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		ErrorResponse(w, "Internal Server Error")
		return
	}

	if err := user.PasswordValidate(); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		ErrorResponse(w, err.Error())
		return
	}

	//update the users password
	newHashedPassword, _ := Hash(user.Password)
	_, err = database.DB.Exec("UPDATE users SET password = $1 WHERE user_id = $2",  newHashedPassword, userId)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		ErrorResponse(w, "Internal Server Error")
	}

	//delete the token
	_, err = database.DB.Exec("DELETE FROM tokens WHERE user_id = $1", userId)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		ErrorResponse(w, "Internal Server Error")
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Password Updated Successfully"})
}