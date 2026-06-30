package utils

import (
	"net/mail"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func IsEmailValid(email string) bool {
	_, err := mail.ParseAddress(email)
	return err == nil
}

// hash a plaintext password
func HashPassword(password string) (string, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(hashed), err
}

// compare a hashed password with a plaintext password
func CheckPassword(hashedPassword, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err == nil
}

// InferUserID extracts the authenticated user's ID from the Gin context
// Returns 0 if no user ID is found (indicating no authentication)
func InferUserID(c *gin.Context) uint {
	// Get the userID from the context
	userID, exists := c.Get(UserIDKey)
	if !exists {
		return 0
	}
	
	// Cast to uint
	id, ok := userID.(uint)
	if !ok {
		return 0
	}
	
	return id
}
