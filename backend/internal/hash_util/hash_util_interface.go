package utils

type HashingServiceInterface interface {
	// HashPassword generates a hashed password using Argon2id algorithm.
	// Parameters:
	//   - password: the plain text password to be hashed.
	//
	// Returns:
	//   - string: the encoded salt and hash, separated by a colon.
	//   - error: an error if any occurs during the hashing process.
	HashPassword(password string) (string, error)

	// CompareHashPassword compares a given password with a stored hash to check if they match.
	//
	// Parameters:
	//   - password: The plaintext password to compare.
	//   - storedHash: The stored hash in the format "salt:hash".
	//
	// Returns:
	//   - bool: True if the password matches the stored hash, otherwise false.
	//   - error: An error if the stored hash format is invalid or if decoding fails.
	CompareHashPassword(password, hashedPassword string) (bool, error)
}
