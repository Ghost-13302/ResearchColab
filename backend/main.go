package main

import (
	"backend/database"
	_ "backend/docs"
	"backend/routes"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title    The Grid Backend API
// @version  0.0
// @host     YOUR_HOST_HERE   <-- swagger UI will infer this at runtime
// @BasePath /
func main() {
	// initialize database
	database.InitDatabase()

	// create router
	router := gin.Default()

	// CORS config: read allowed origin from env (default to localhost:4200)
	frontend := os.Getenv("FRONTEND_ORIGIN")
	if frontend == "" {
		frontend = "http://localhost:4200"
	}
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{frontend},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// register your routes
	routes.AuthRoutes(router)
	routes.UsersRoutes(router)
	routes.ProjectsRoutes(router)

	// swagger endpoint (optional)
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// figure out which port to listen on (default 8080 for local dev)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// start server
	if err := router.Run(":" + port); err != nil {
		panic(err)
	}
}
