#!/usr/bin/env bash

echo "Generating mocks..."
# Define the directories to watch for changes
WATCH_DIRS=(
    "repository/user_repository"
    "services/user_services"
    "services/token_services"
    "internal/hash_util"
    "internal/tokenGenerator_util"
)

# Define a function to generate mocks for specific interfaces
generate_mock() {
    case $1 in
        "repository/user_repository")
            echo "Generating mock for UserRepositoryInterface..."
            mockery --name UserRepositoryInterface --dir ./repository/user_repository --output ./repository/mocks
            ;;
        "services/user_services")
            echo "Generating mock for UserServiceInterface..."
            mockery --name UserServiceInterface --dir ./services/user_services --output ./services/mocks
            ;;
        "services/token_services")
            echo "Generating mock for TokenServiceInterface..."
            mockery --name TokenServiceInterface --dir ./services/token_services --output ./services/mocks
            ;;
        "internal/hash_util")
            echo "Generating mock for HashingServiceInterface..."
            mockery --name HashingServiceInterface --dir ./internal/hash_util --output ./internal/mocks
            ;;
        "internal/tokenGenerator_util")
            echo "Generating mock for JWTTokenGeneratorUtilInterface..."
            mockery --name JWTTokenGeneratorUtilInterface --dir ./internal/tokenGenerator_util --output ./internal/mocks
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
