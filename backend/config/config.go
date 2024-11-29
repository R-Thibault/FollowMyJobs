package config

// © Rossa Thibault 2024. Tous droits réservés.
// Ce code est la propriété de Rossa Thibault et ne peut être utilisé,
// distribué ou modifié sans autorisation explicite.
import (
	"log"

	"github.com/spf13/viper"
)

func SetupConfig() {
	// Looking for ".env" file and try to read it
	viper.SetConfigFile(".env")
	err := viper.ReadInConfig()
	if err != nil {
		log.Printf("Warning: Error reading .env file: %v. Falling back to environment variables.", err)
	}
	viper.AutomaticEnv() // Automatically read environment variables

	// Log non-sensitive configuration
	log.Printf("Environment: %s", viper.GetString("APP_ENV"))
	log.Printf("Port: %s", viper.GetString("POSTGRES_PORT"))

}

func GetConfig(key string) string {
	value := viper.GetString(key)
	if value == "" {
		log.Printf("Warning: Configuration key '%s' not set or empty", key)
	}
	return value
}
