package handlers

import (
	"encoding/json"
	"flashquiz-server/internal/models"
	"flashquiz-server/internal/service"
	"io"
	"net/http"
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