module flashquiz-server

go 1.23.0

toolchain go1.24.2

require golang.org/x/crypto v0.38.0

require github.com/lib/pq v1.10.9

require github.com/joho/godotenv v1.5.1

require (
	github.com/go-chi/httprate v0.15.0
	github.com/golang-jwt/jwt/v5 v5.2.2
	gopkg.in/gomail.v2 v2.0.0-20160411212932-81ebce5c23df
)

require (
	github.com/klauspost/cpuid/v2 v2.2.10 // indirect
	github.com/zeebo/xxh3 v1.0.2 // indirect
	golang.org/x/sys v0.33.0 // indirect
	gopkg.in/alexcesaro/quotedprintable.v3 v3.0.0-20150716171945-2caba252f4dc // indirect
)
