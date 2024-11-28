package models

type Status struct {
	Applied  *bool `json:"applied"`
	Response *bool `json:"response"`
	FollowUp *bool `json:"followUp"`
}

type RequestSettings struct {
	Limit            int     `json:"limit"`
	OffSet           int     `json:"offSet"`
	OrderByCreatedAt string  `json:"orderByCreatedAt"`
	Title            *string `json:"title"`
	Status           Status  `json:"status"`
}
