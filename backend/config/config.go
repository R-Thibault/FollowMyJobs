package config

// © Rossa Thibault 2024. Tous droits réservés.
// Ce code est la propriété de Rossa Thibault et ne peut être utilisé,
// distribué ou modifié sans autorisation explicite.
import (
	"log"

	"github.com/spf13/viper"
)

func SetupConfig() {
	// Looking for ".env" file and try read it
	viper.SetConfigFile(".env")
	if err := viper.ReadInConfig(); err != nil {
		log.Fatalf("Error reading config file: %v", err)
	}

	viper.AutomaticEnv() // Automatically read environment variables
	// Debug: Print all configuration values
	log.Println("Loaded Configuration:")
	for _, key := range viper.AllKeys() {
		log.Printf("%s = %s", key, viper.GetString(key))
	}
}

func GetConfig(key string) string {
	value := viper.GetString(key)
	if value == "" {
		log.Printf("Warning: Configuration key '%s' not set or empty", key)
	}
	return value
}
