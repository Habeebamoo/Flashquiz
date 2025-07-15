package handlers

import (
	"encoding/json"
	"flashquiz-server/internal/database"
	"flashquiz-server/internal/models"
	"flashquiz-server/internal/service"
	"io"
	"net/http"
	"time"
)

func FetchQuiz(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		ErrorResponse(w, "Method Not Allowed")
		return
	}

	quizForm := &models.QForm{}
	if err := json.NewDecoder(r.Body).Decode(&quizForm); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		ErrorResponse(w, "Invalid JSON Format")
		return
	}

	if err := quizForm.Validate(); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		ErrorResponse(w, err.Error())
		return
	}

	url := service.GetUrl(quizForm)

	resp, err := http.Get(url)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		ErrorResponse(w, err.Error())
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	var triviaResponse models.TriviaResponse
	if err := json.Unmarshal(body, &triviaResponse); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		ErrorResponse(w, "Internal Server Error")
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(triviaResponse)
}

func UploadQuiz(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		ErrorResponse(w, "Method Not Allowed")
		return
	}

	//validates quiz request
	quizResult := &models.QResults{}
	if err := json.NewDecoder(r.Body).Decode(&quizResult); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		ErrorResponse(w, "Invalid JSON Format")
		return
	}

	if err := quizResult.Validate(); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		ErrorResponse(w, err.Error())
		return
	}

	//update quizzes table
	_, err := database.DB.Exec("INSERT INTO quizzes (user_id, category, score, completed_at) VALUES ($1, $2, $3, $4)", quizResult.UserId, quizResult.Category, quizResult.Score, time.Now())
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		ErrorResponse(w, "Internal Server Error")
		return
	}

	var totalScore float64
	var scores []float64
	var totalPoints float64

	//get all scores
	rows, err := database.DB.Query("SELECT score FROM quizzes WHERE user_id = $1", quizResult.UserId)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		ErrorResponse(w, "Internal Server Error")
		return
	}
	defer rows.Close()

	for rows.Next() {
		var score float64
		if err := rows.Scan(&score); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			ErrorResponse(w, "Internal Server Error")
			return
		}
		scores = append(scores, score)
	}

	//calculate avergae score
	for _, score := range scores {
		totalScore += score
	}
	averageScore := totalScore / len(scores)

	//update and get points
	if err := database.DB.QueryRow("UPDATE records SET points = points + $1 WHERE user_id = $2 RETURNING points", quizResult.Points, quizResult.UserId).Scan(&totalPoints); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		ErrorResponse(w, "Internal Server Error")
		return
	}

	newRank := service.GetRank(totalPoints)

	//update records table
	if _, err := database.DB.Exec("UPDATE records SET quiz_completed = quiz_completed + 1, avg_score = $1, rank = $2 WHERE user_id = $3", averageScore, newRank, quizResult.UserId); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		ErrorResponse(w, "Internal Server Error")
		return		
	}

	service.JsonResponse(w, http.StatusCreated, "Quiz Uploaded")
}