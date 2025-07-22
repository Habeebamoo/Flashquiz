package models

import (
	"errors"
)

type QForm struct {
	Category    string  `json:"category"`
	Amount      int     `json:"amount"`
}

type QResults struct {
	UserId       string     `json:"userId"`
	Score        int        `json:"score"`
	Points       int        `json:"points"`
}

type TriviaResponse struct {
	ResponseCode  int             `json:"response_code"`
	Results       []TriviaResult  `json:"results"`
}

type TriviaResult struct {
	Type              string    `json:"type"`
	Difficulty        string    `json:"difficulty"`
	Category          string    `json:"category"`
	Question          string    `json:"question"`
	CorrectAnswer     string    `json:"correct_answer"`
	IncorrectAnswers  []string  `json:"incorrect_answers"`
}

func (qForm *QForm) Validate() error {
	if qForm.Category == "" {
		return errors.New("category was not provided")
	} else if qForm.Amount < 10 {
		return errors.New("amount was not provided")
	}
	return nil
}

func (qRes *QResults) Validate() error {
	if qRes.UserId == "" {
		return errors.New("user id is missing")
	} else if qRes.Score < 0 {
		return errors.New("score is missing")
	} else if qRes.Points < 0 {
		return errors.New("points is missing")
	}
	return nil
}
