package service

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"flashquiz-server/internal/models"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/gomail.v2"
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

func ErrorResponse(w http.ResponseWriter, msg string) {
	json.NewEncoder(w).Encode(map[string]string{
		"error": msg,
	})
}

func SendPasswordResetLink(userEmail, userName, token string) error {
	m := gomail.NewMessage()

	m.SetHeader("From", "flashquizweb@gmail.com")
	m.SetHeader("To", userEmail)
	m.SetHeader("Subject", "Reset Your Password")

	body := fmt.Sprintf(`
		<html>
			<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
				<h2 style="color: #1a73e8">FlashQuiz</h2>
				<p>Hi %s</p>

				<p>We've receive your request to reset your password.</p>
				<p>To reset your password, click on the link below</p>

				<p><a href="https://flashquizweb.netlify.app/reset-password?token=%s" style="color: white; background-color: #1a73e8; padding: 15px; display: block; text-align: center; font-weight: bold; font-size: 1.2em;">Reset Password</a></p>

				<p>If you did not request a password reset, you can safely ignore this email.</p>
				<p>For security purpose, this link will expire in 1 hour.</p>
				<br>
				<p>Thank you</p>
				<br>
				
				<p>Best regards,<br>FlashQuiz Team</p>
			</body>
		</html>
	`, userName, token)

	m.SetBody("text/html", body)

	d := gomail.NewDialer("smtp.gmail.com", 465, "flashquizweb@gmail.com", os.Getenv("APP_PASSWORD"))
	d.SSL = true

	if err := d.DialAndSend(m); err != nil {
		return err
	}

	return nil
}

func SendVerification(userEmail, userName, token string) error {
	m := gomail.NewMessage()

	m.SetHeader("From", "flashquizweb@gmail.com")
	m.SetHeader("To", userEmail)
	m.SetHeader("Subject", "Verify your FlashQuiz account.")

	body := fmt.Sprintf(`
		<html>
			<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
				<h2 style="color: #1a73e8">Welcome to FlashQuiz</h2>
				<p>Dear %s</p>

				<p>Thank you for creating an account on <strong>FlashQuiz</strong>, the ultimate destination for trivia and fun.</p>

				<p>To complete your registration and activate your account, please confirm your email address by clicking the button below:</p>

				<p><a href="https://flashquizweb.netlify.app/verify?token=%s" style="color: white; background-color: #1a73e8; padding: 20px; display: block; text-align: center; font-weight: bold; font-size: 1.2em;">Verify My Email</a></p>

				<p>This verification grants you access to all our website features and quizzes, it also helps us secure your account and ensure only you have access to it.</p>

				<p>If you didn't sign up for FlashQuiz, you can safely ignore this email</p>
				<br>
				<p>Thank you for choosing FlashQuiz.</p>

				<br>
				<p>Best regards,<br>FlashQuiz Team</p>
			</body>
		</html>
	`, userName, token)

	m.SetBody("text/html", body)

	d := gomail.NewDialer("smtp.gmail.com", 465, "flashquizweb@gmail.com", os.Getenv("APP_PASSWORD"))
	d.SSL = true

	if err := d.DialAndSend(m); err != nil {
		return err
	}

	return nil
}

func ResendVerification(userEmail, userName, token string) error {
	m := gomail.NewMessage()

	m.SetHeader("From", "flashquizweb@gmail.com")
	m.SetHeader("To", userEmail)
	m.SetHeader("Subject", "Verify your FlashQuiz account.")

	body := fmt.Sprintf(`
		<html>
			<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
				<h2 style="color: #1a73e8">Welcome to FlashQuiz</h2>
				<p>Hi %s</p>

				<p>We've received your request to verify your email address.</p>
				<p>You can proceed to activating your account by clicking on the link below.</p>

				<p><a href="https://flashquizweb.netlify.app/verify?token=%s" style="color: white; background-color: #1a73e8; padding: 20px; display: block; text-align: center; font-weight: bold; font-size: 1.2em;">Verify My Email</a></p>

				<p>This verification grants you access to all our website features and quizzes, it also helps us secure your account and ensure only you have access to it.</p>

				<p>If you didn't asks for this, you can safely ignore this email</p>
				<br>
				<p>Thank you for choosing FlashQuiz.</p>

				<br>
				<p>Best regards,<br>FlashQuiz Team</p>
			</body>
		</html>
	`, userName, token)

	m.SetBody("text/html", body)

	d := gomail.NewDialer("smtp.gmail.com", 465, "flashquizweb@gmail.com", os.Getenv("APP_PASSWORD"))
	d.SSL = true

	if err := d.DialAndSend(m); err != nil {
		return err
	}

	return nil
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
