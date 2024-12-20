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
	// Get additionnal setting for query
	var requestSettings models.RequestSettings
	limit, err := strconv.Atoi(c.Param("page_size"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page size"})
		return
	}
	offSet, err := strconv.Atoi(c.Param("page"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page size"})
		return
	}
	requestSettings.Limit = limit
	requestSettings.OffSet = offSet

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
	applications, totalItems, err := app.ApplicationService.GetApplicationsByUserID(existingUser.ID, requestSettings)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Can't find applications for this user"})
		return
	}
	totalPages := (totalItems + int64(requestSettings.Limit) - 1) / int64(requestSettings.Limit)

	response := gin.H{
		"datas": applications,
		"pagintation": gin.H{
			"current_page": requestSettings.OffSet,
			"page_size":    requestSettings.Limit,
			"total_pages":  totalPages,
			"total_items":  totalItems,
		},
		"filter": gin.H{
			"title":            *requestSettings.Title,
			"orderByCreatedAt": requestSettings.OrderByCreatedAt,
			"status": gin.H{
				"applied":  *requestSettings.Status.Applied,
				"response": *requestSettings.Status.Response,
				"followUp": *requestSettings.Status.FollowUp,
			},
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
