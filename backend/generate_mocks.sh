#!/usr/bin/env bash

echo "Generating mocks..."
# Define the directories to watch for changes
WATCH_DIRS=(
    "repository/application_repository"
    "repository/user_repository"
    "repository/otp_repository"
    "services/user_services"
    "services/token_services"
    "services/application_services"
    "services/otp_services"
    "services/registration_services"
    "internal/hash_util"
    "internal/tokenGenerator_util"
    "internal/otpGenerator_util"
)

# Define a function to generate mocks for specific interfaces
generate_mock() {
    case $1 in
        "repository/application_repository")
            echo "Generating mock for ApplicationRepositoryInterface..."
            mockery --name ApplicationRepositoryInterface --dir ./repository/application_repository --output ./repository/mocks
            ;;
        "repository/user_repository")
            echo "Generating mock for UserRepositoryInterface..."
            mockery --name UserRepositoryInterface --dir ./repository/user_repository --output ./repository/mocks
            ;;
        "repository/otp_repository")
            echo "Generating mock for OTPRepositoryInterface..."
            mockery --name OTPRepositoryInterface --dir ./repository/otp_repository --output ./repository/mocks
            ;;
        "services/user_services")
            echo "Generating mock for UserServiceInterface..."
            mockery --name UserServiceInterface --dir ./services/user_services --output ./services/mocks
            ;;
        "services/token_services")
            echo "Generating mock for TokenServiceInterface..."
            mockery --name TokenServiceInterface --dir ./services/token_services --output ./services/mocks
            ;;
        "services/application_services")
            echo "Generating mock for ApplicationServiceInterface..."
            mockery --name ApplicationServiceInterface --dir ./services/application_services --output ./services/mocks
            ;;
        "services/otp_services")
            echo "Generating mock for OTPServiceInterface..."
            mockery --name OTPServiceInterface --dir ./services/otp_services --output ./services/mocks
            ;;
        "services/registration_services")
            echo "Generating mock for OTPServiceInterface..."
            mockery --name OTPServiceInterface --dir ./services/registration_services --output ./services/mocks
            ;;
        "internal/hash_util")
            echo "Generating mock for HashingServiceInterface..."
            mockery --name HashingServiceInterface --dir ./internal/hash_util --output ./internal/mocks
            ;;
        "internal/tokenGenerator_util")
            echo "Generating mock for JWTTokenGeneratorUtilInterface..."
            mockery --name JWTTokenGeneratorUtilInterface --dir ./internal/tokenGenerator_util --output ./internal/mocks
            ;;
        "internal/otpGenerator_util")
            echo "Generating mock for OtpGeneratorServiceInterface..."
            mockery --name OtpGeneratorServiceInterface --dir ./internal/otpGenerator_util --output ./internal/mocks
            ;;
        *)
            echo "No matching file for mock generation."
            ;;
    esac
}

# Loop through each directory and check for changes
for dir in "${WATCH_DIRS[@]}"; do
    # Check if any .go file in the directory has been modified in the last minute
    if find "$dir" -name "*.go" -mmin -1 | grep -q .; then
        generate_mock "$dir"
    fi
done
