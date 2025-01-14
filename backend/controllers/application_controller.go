package controllers

import (
	"log"
	"net/http"
	"strconv"

	"github.com/R-Thibault/FollowMyJobs/backend/models"
	applicationservices "github.com/R-Thibault/FollowMyJobs/backend/services/application_services"
	userServices "github.com/R-Thibault/FollowMyJobs/backend/services/user_services"
	"github.com/gin-gonic/gin"
)

type ApplicationController struct {
	UserService        userServices.UserServiceInterface
	ApplicationService applicationservices.ApplicationServiceInterface
}

func NewApplicationController(UserService userServices.UserServiceInterface, ApplicationService applicationservices.ApplicationServiceInterface) *ApplicationController {
	return &ApplicationController{UserService: UserService, ApplicationService: ApplicationService}
}

func (app *ApplicationController) SaveApplication(c *gin.Context) {
	var appData models.Application
	if err := c.ShouldBindJSON(&appData); err != nil {
		log.Printf("APPDATA: %v", appData)
		log.Printf("ERROR: %v", err)
		// If the input is invalid, respond with an error
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	userUUID, exists := c.Get("userUUID")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "UserUUID not Found in context"})
		return
	}
	userUUIDStr, ok := userUUID.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "UserUUID in context is not a a valid string"})
		return
	}

	existingUser, err := app.UserService.GetUserByUUID(userUUIDStr)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "UserUUID do not match a user"})
		return
	}
	appErr := app.ApplicationService.SaveApplication(existingUser.ID, appData)
	if appErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Saving application failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Application saved successfully"})
}

func (app *ApplicationController) UpdateApplication(c *gin.Context) {
	var appData models.Application
	if err := c.ShouldBindJSON(&appData); err != nil {
		// If the input is invalid, respond with an error
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	userUUID, exists := c.Get("userUUID")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "UserUUID not Found in context"})
		return
	}
	userUUIDStr, ok := userUUID.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "UserUUID in context is not a a valid string"})
		return
	}

	existingUser, err := app.UserService.GetUserByUUID(userUUIDStr)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "UserUUID do not match a user"})
		return
	}
	UpdatedApplication, err := app.ApplicationService.UpdateApplication(existingUser.ID, appData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error during application update"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"UpdatedApplication": UpdatedApplication})
}

func (app *ApplicationController) GetApplicationByID(c *gin.Context) {
	idStr := c.Param("id")
	applicationID, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	userUUID, exists := c.Get("userUUID")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "UserUUID not Found in context"})
		return
	}
	userUUIDStr, ok := userUUID.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "UserUUID in context is not a a valid string"})
		return
	}
	existingUser, err := app.UserService.GetUserByUUID(userUUIDStr)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "UserUUID do not match a user"})
		return
	}

	application, appErr := app.ApplicationService.GetApplicationByID(existingUser.ID, uint(applicationID))
	if appErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Can't get application informations"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": application})
}

func (app *ApplicationController) GetAllApplicationsByUserID(c *gin.Context) {
	var requestSettings models.RequestSettings

	// Parsing limit and offset
	limitStr := c.DefaultQuery("limit", "10")
	offSetStr := c.DefaultQuery("offset", "0")

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page_size"})
		return
	}

	offSet, err := strconv.Atoi(offSetStr)
	if err != nil || offSet < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page number"})
		return
	}

	requestSettings.Limit = limit
	requestSettings.OffSet = offSet

	// Sorting logic with validation
	allowedSortFields := map[string]bool{
		"created_at": true,
		"location":   true,
		"title":      true,
		"salary":     true,
		"url":        true,
		"updated_at": true,
	}

	// Default sorting
	sortBy := c.DefaultQuery("sortBy", "updated_at")
	if !allowedSortFields[sortBy] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid sort field"})
		return
	}
	sortOrder := c.DefaultQuery("sortOrder", "desc")
	if sortOrder != "asc" && sortOrder != "desc" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid sort order"})
		return
	}
	requestSettings.SortBy = sortBy
	requestSettings.SortOrder = sortOrder

	title := c.Query("titleSearch")
	if title != "" {
		requestSettings.Title = &title
	}

	// Retrieve userUUID from Gin context
	userUUID, exists := c.Get("userUUID")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "UserUUID not found in context"})
		return
	}
	userUUIDStr, ok := userUUID.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "UserUUID is not a valid string"})
		return
	}

	// Validate user
	existingUser, err := app.UserService.GetUserByUUID(userUUIDStr)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "UserUUID does not match any user"})
		return
	}

	// Fetch applications based on the validated user ID and request settings
	applications, totalItems, err := app.ApplicationService.GetApplicationsByUserID(existingUser.ID, requestSettings)
	if err != nil {
		log.Printf("Controller err: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unable to retrieve applications"})
		return
	}

	// Calculate total pages for pagination
	totalPages := (totalItems + int64(requestSettings.Limit) - 1) / int64(requestSettings.Limit)

	// Build the response safely handling pointers
	response := gin.H{
		"datas": applications,
		"pagination": gin.H{
			"current_page": requestSettings.OffSet,
			"page_size":    requestSettings.Limit,
			"total_pages":  totalPages,
			"total_items":  totalItems,
		},
		"sort": gin.H{
			"sortBy":    requestSettings.SortBy,
			"sortOrder": requestSettings.SortOrder,
		},
	}

	c.JSON(http.StatusOK, response)
}

func (app *ApplicationController) DeleteApplication(c *gin.Context) {
	var appData models.Application
	if err := c.ShouldBindJSON(&appData); err != nil {
		// If the input is invalid, respond with an error
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	userUUID, exists := c.Get("userUUID")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "UserUUID not Found in context"})
		return
	}
	userUUIDStr, ok := userUUID.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "UserUUID in context is not a a valid string"})
		return
	}
	existingUser, err := app.UserService.GetUserByUUID(userUUIDStr)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "UserUUID do not match a user"})
		return
	}
	deleteErr := app.ApplicationService.DeleteApplication(existingUser.ID, appData.ID)
	if deleteErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error during application supression"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "application delete successfully"})
}

func (app *ApplicationController) UpdateApplicationStatus(c *gin.Context) {
	var appStatus models.ApplicationStatusRequest
	if err := c.ShouldBindJSON(&appStatus); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}
	userUUID, exists := c.Get("userUUID")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "UserUUID not Found in context"})
		return
	}
	userUUIDStr, ok := userUUID.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "UserUUID in context is not a a valid string"})
		return
	}
	existingUser, err := app.UserService.GetUserByUUID(userUUIDStr)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "UserUUID do not match a user"})
		return
	}
	statusErr := app.ApplicationService.UpdateApplicationStatus(existingUser.ID, appStatus)
	if statusErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error during status update"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "application status update successfully"})
}
