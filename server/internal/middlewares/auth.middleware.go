package middlewares

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"strings"

	"flashquiz-server/internal/service"
	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

var UserIdKey contextKey = "userID"

var (
	ErrorResponse = service.ErrorResponse
)

// middleware for API key
func RequireAPIKey(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		apiKey := r.Header.Get("X-API-KEY")
		if apiKey == "" {
			ErrorResponse(w, http.StatusUnauthorized, "Missing API Key")
			return
		}

		if apiKey != os.Getenv("API_KEY") {
			ErrorResponse(w, http.StatusUnauthorized, "Invalid API Key")
			return
		}

		next.ServeHTTP(w, r)
	})
}

// middleware for JWT Auth
func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/api/auth/login" || r.URL.Path == "/api/auth/register" || r.URL.Path == "/api/user/verify" || r.URL.Path == "/api/user/password/forgot" || r.URL.Path == "/api/user/password/reset" || r.URL.Path == "/api" {
			next.ServeHTTP(w, r)
			return
		}

		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			ErrorResponse(w, http.StatusUnauthorized, "Authorization Header Missing")
			return
		}

		if !strings.HasPrefix(authHeader, "Bearer ") {
			ErrorResponse(w, http.StatusUnauthorized, "Invalid Authorization Header Format")
			return
		}

		tokenStrings := strings.TrimPrefix(authHeader, "Bearer")
		tokenStr := strings.TrimSpace(tokenStrings)

		token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method %v", token.Header["alg"])
			}
			return []byte(os.Getenv("JWT_KEY")), nil
		})

		if err != nil || !token.Valid {
			ErrorResponse(w, http.StatusUnauthorized, "Invalid Token")
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			ErrorResponse(w, http.StatusUnauthorized, "Cannot Verify Token")
			return
		}

		userId, ok := claims["userId"].(string)
		if !ok {
			ErrorResponse(w, http.StatusUnauthorized, "Invalid Token Payload")
			return
		}

		ctx := context.WithValue(r.Context(), UserIdKey, userId)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
