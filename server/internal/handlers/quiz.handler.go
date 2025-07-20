package handlers

import (
	"encoding/json"
	"flashquiz-server/internal/database"
	"flashquiz-server/internal/models"
	"flashquiz-server/internal/service"
	"io"
	"math"
	"net/http"
	"time"
)

func FetchQuiz(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodPost {
		ErrorResponse(w, http.StatusMethodNotAllowed, "Method Not Allowed")
		return
	}

	quizForm := &models.QForm{}
	if err := json.NewDecoder(r.Body).Decode(&quizForm); err != nil {
		ErrorResponse(w, http.StatusBadRequest, "Invalid JSON Format")
		return
	}

	if err := quizForm.Validate(); err != nil {
		ErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	url := service.GetUrl(quizForm)

	resp, err := http.Get(url)
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	var triviaResponse models.TriviaResponse
	if err := json.Unmarshal(body, &triviaResponse); err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Internal Server Error")
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(triviaResponse)
}

func UploadQuiz(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodPost {
		ErrorResponse(w, http.StatusMethodNotAllowed, "Method Not Allowed")
		return
	}

	//validates quiz request
	quizResult := &models.QResults{}
	if err := json.NewDecoder(r.Body).Decode(&quizResult); err != nil {
		ErrorResponse(w, http.StatusBadRequest, "Invalid JSON Format")
		return
	}

	if err := quizResult.Validate(); err != nil {
		ErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	//update quizzes table
	_, err := database.DB.Exec("INSERT INTO quizzes (user_id, category, score, completed_at) VALUES ($1, $2, $3, $4)", quizResult.UserId, quizResult.Category, quizResult.Score, time.Now())
	if err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Internal Server Error: quiz")
		return
	}

	var averageScore float64
	var totalPoints int

	//update and get points
	if err := database.DB.QueryRow("UPDATE records SET points = points + $1 WHERE user_id = $2 RETURNING points", quizResult.Points, quizResult.UserId).Scan(&totalPoints); err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Internal Server Error: pts")
		return
	}

	//get averageScore
	if err := database.DB.QueryRow("SELECT AVG(score) FROM quizzes WHERE user_id = $1", quizResult.UserId).Scan(&averageScore); err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Internal Server Error: avgscore")
		return
	}

	newRank := service.GetRank(totalPoints)
	intAvgScore := math.Round(averageScore)

	//update records table
	if _, err := database.DB.Exec("UPDATE records SET quiz_completed = quiz_completed + 1, avg_score = $1, rank = $2 WHERE user_id = $3", intAvgScore, newRank, quizResult.UserId); err != nil {
		ErrorResponse(w, http.StatusInternalServerError, "Internal Server Error: recordsa")
		return
	}

	service.JsonResponse(w, http.StatusCreated, "Quiz Uploaded")
}
