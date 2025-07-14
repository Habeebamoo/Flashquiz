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
	JsonResponse = service.JsonResponse
)

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request){
		if r.URL.Path == "/api/auth/login" || r.URL.Path == "/api/auth/register" || r.URL.Path == "/api/user/verify" || r.URL.Path == "/api/user/forgot-password" || r.URL.Path == "/api/user/reset-password" || r.URL.Path == "/api" {
			next.ServeHTTP(w, r)
			return
		}

		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			JsonResponse(w, http.StatusUnauthorized, "Authorization Header Missing")
			return
		}

		if !strings.HasPrefix(authHeader, "Bearer ") {
			JsonResponse(w, http.StatusUnauthorized, "Invalid Authorization Header Format")
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
			JsonResponse(w, http.StatusUnauthorized, "Invalid Token")
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			JsonResponse(w, http.StatusUnauthorized, "Cannot Verify Token")
			return
		}

		userId, ok := claims["userId"].(string)
		if !ok {
			JsonResponse(w, http.StatusUnauthorized, "Invalid Token Payload")
			return
		}

		ctx := context.WithValue(r.Context(), UserIdKey, userId)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
