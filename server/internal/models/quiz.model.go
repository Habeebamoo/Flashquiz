package models

import "errors"

type QForm struct {
	Category    string  `json:"category"`
	Time        float64 `json:"time"`
	Difficulty  string  `json:"difficulty"`
	Amount      int     `json:"amount"`
	Type        string  `json:"type"`
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
	} else if qForm.Time < 0.5 {
		return errors.New("time was not provided")
	} else if qForm.Difficulty == "" {
		return errors.New("difficuly was not provided")
	} else if qForm.Amount < 10 {
		return errors.New("amount was not provided")
	} else if qForm.Type == "" {
		return errors.New("option type was not provided")
	}
	return nil
}
