package main

import (
	"backend/database"
	_ "backend/docs"
	"backend/routes"
	"os"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title    The Grid Backend API
// @version  0.0
// @host     inferred at runtime
// @BasePath /
func main() {
	// initialize DB
	database.InitDatabase()

	// create router
	router := gin.Default()

	// build allowed-origins list
	raw := os.Getenv("ALLOWED_ORIGINS")
	var origins []string
	if raw != "" {
		origins = strings.Split(raw, ",")
	} else {
		origins = []string{
			"http://localhost:4200",
			"https://ghost-13302.github.io",
			"https://swecrocs.github.io",
		}
	}

	// apply CORS middleware
	router.Use(cors.New(cors.Config{
		AllowOrigins:     origins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// register routes
	routes.AuthRoutes(router)
	routes.UsersRoutes(router)
	routes.ProjectsRoutes(router)

	// swagger (if you need it)
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// pick up port for Render or default to 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// start server
	if err := router.Run(":" + port); err != nil {
		panic(err)
	}
}
