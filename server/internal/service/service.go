package service

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"os"
	"time"

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
	_, err := rand.Read(bytes)
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
	difficulty := qForm.Difficulty
	qType := qForm.Type

	switch qForm.Category {
	case "Science":
		category = 17
	case "Arts":
		category = 25
	case "History":
		category = 23
	case "Tech":
		category = 18
	case "Sports":
		category = 21
	case "Anime":
		category = 31
	case "Mythology":
		category = 20
	default:
		category = 17
	}

	url := fmt.Sprintf("https://opentdb.com/api.php?amount=%d&category=%d&difficulty=%s&type=%s", amount, category, difficulty, qType)

	return url
}
