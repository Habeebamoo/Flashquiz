package middlewares

import (
	"log"
	"net/http"

	"flashquiz-server/internal/service"
)

var (
	JsonResponse = service.JsonResponse
)

func Recovery(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if r := recover(); r != nil {
				log.Println("Recovered from panic", r)
				JsonResponse(w, http.StatusInternalServerError, "Internal Server Error")
			}
		}()

		next.ServeHTTP(w, r)
	})
}
