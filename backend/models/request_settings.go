package models

type RequestSettings struct {
	Limit     int     `json:"limit"`
	OffSet    int     `json:"offSet"`
	Title     *string `json:"title"`
	Status    Status  `json:"status"`
	SortBy    string  `json:"sortBy"`
	SortOrder string  `json:"sortOrder"`
}
