package service

import (
	crand "crypto/rand"
	"encoding/hex"
	"fmt"
	"os"
	"time"
	mrand "math/rand"

	"flashquiz-server/internal/models"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func Hash(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(hashedPassword), err
}

func Verify(hashedPassword, password string) error {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	if err != nil {
		return err
	}
	return nil
}

func GenerateToken() (string, error) {
	bytes := make([]byte, 16)
	_, err := crand.Read(bytes)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

func GenerateJWT(id string) (string, error) {
	claims := jwt.MapClaims{
		"userId": id,
		"exp": time.Now().Add(24*time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_KEY")))
}

func GetUrl(qForm *models.QForm) string {
	var category int

	amount := qForm.Amount
	difficulty := []string{"easy", "medium"}[mrand.Intn(2)]
	qType := []string{"boolean", "multiple"}[mrand.Intn(2)]

	switch qForm.Category {
	case "Science":
		category = 17
	case "Arts":
		category = 25
	case "History":
		category = 23
	case "Computers":
		category = 18
	case "Sports":
		category = 21
	case "Anime":
		category = 31
	case "Mythology":
		category = 20
	case "Politics":
		category = 24
	default:
		category = 17
	}

	url := fmt.Sprintf("https://opentdb.com/api.php?amount=%d&category=%d&difficulty=%s&type=%s", amount, category, difficulty, qType)

	return url
}

func GetRank(pts int) string {
	var rank string

	if pts >= 5000 {
		rank = "Emperal"
	} else if pts >= 4000 {
		rank = "Grand Legend"
	} else if pts >= 3000 {
		rank = "Legend"
	} else if pts >= 2200 {
		rank = "Grand Master"
	} else if pts >= 1600 {
		rank = "Master"
	} else if pts >= 1100 {
		rank = "Expert"
	} else if pts >= 700 {
		rank = "Scholar"
	} else if pts >= 400 {
		rank = "Thinker"
	} else if pts >= 200 {
		rank = "Learner"
	} else if pts >= 100 {
		rank = "Beginner"
	} else {
		rank = "Noob"
	}

	return rank
}
