package config

import (
	"log"

	"github.com/spf13/viper"
)

// Config stores all the configuration for the application
// using values read from the config file or env variables
type Config struct {
	RedisUrl      string `mapstructure:"REDIS_URL"`
	FinnHubAPIKey string `mapstructure:"FINNHUB_API_KEY"`
}

var EnvVars Config

// LoadConfig loads the configuration from the config file or env variable
func LoadConfig() {
	viper.SetConfigFile(".env")
	err := viper.ReadInConfig()
	if err != nil {
		log.Println("Cannot read config file:", err)
	}
	viper.AutomaticEnv()

	EnvVars.RedisUrl = viper.GetString("REDIS_URL")
	EnvVars.FinnHubAPIKey = viper.GetString("FINNHUB_API_KEY")
}
