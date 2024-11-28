# Documentation des routes API

Ce document décrit les différentes routes publiques disponibles dans l'application, leurs objectifs, leurs utilisations, ainsi que les paramètres de requête nécessaires.

---

## **Routes publiques**

### 1. **Connexion utilisateur**

- **Méthode**: `POST`
- **Endpoint**: `/login`
- **Description**: Permet à un utilisateur de se connecter à l'application.
- **Controller**: `AuthController.Login`
- **Paramètres de requête**:
  - **email** _(string, requis)_: Adresse email de l'utilisateur.
  - **password** _(string, requis)_: Mot de passe de l'utilisateur.

#### Exemple de corps de requête :

```json
{
  "email": "utilisateur@example.com",
  "password": "MotDePasse123"
}
```

## 2. Déconnexion utilisateur

- **Méthode**: `POST`
- **Endpoint**: `/logout`
- **Description**: Permet à un utilisateur connecté de se déconnecter de l'application.
- **Controller**: `AuthController.Logout`
- **Paramètres de requête**:
  - Aucun.

## 3. Inscription utilisateur

- **Méthode**: `POST`
- **Endpoint**: `/sign-up`
- **Description**: Permet à un utilisateur de créer un compte.
- **Controller**: `UserController.SignUp`
- **Paramètres de requête**:
  - **email** _(string, requis)_: Adresse email de l'utilisateur.
  - **password** _(string, requis)_: Mot de passe choisi par l'utilisateur.
  - **confirmPassword** _(string, requis)_: confirmation du mot de passe.

#### Exemple de corps de requête :

```json
{
  "email": "nouveau.utilisateur@example.com",
  "password": "MotDePasse123",
  "confirmPassword": "MotDePasse123"
}
```

## 4. Génération d'OTP

- **Méthode**: `POST`
- **Endpoint**: `/generate-otp`
- **Description**: Génère un code OTP pour la validation lors de l'inscription.
- **Controller**: `OTPController.GenerateOTPForSignUp`
- **Paramètres de requête**:
  - **email** _(string, requis)_: Adresse email pour laquelle l'OTP sera généré.

#### Exemple de corps de requête :

```json
{
  "email": "utilisateur@example.com"
}
```

## 5. Validation de l'OTP

- **Méthode**: `POST`
- **Endpoint**: `/verify-otp`
- **Description**: Vérifie un code OTP pour la validation lors de l'inscription.
- **Controller**: `OTPController.ValidateOTPForSignUp`
- **Paramètres de requête**:
  - **email** _(string, requis)_: Adresse email associée à l'OTP.
  - **otp** _(string, requis)_: Le code OTP à vérifier.

#### Exemple de corps de requête :

```json
{
  "email": "utilisateur@example.com",
  "otp": "123456"
}
```

## 6. Réinitialisation du mot de passe

- **Méthode**: `POST`
- **Endpoint**: `/reset-password`
- **Description**: Permet de réinitialiser un mot de passe à l'aide d'un nouveau mot de passe.
- **Controller**: `UserController.ResetPassword`
- **Paramètres de requête**:
  - **email** \_(string, requis): email du compte concerner par le reset de mot de passe
  - **token** _(string, requis)_: Jeton valide pour autoriser la réinitialisation.
  - **Password** _(string, requis)_: Le nouveau mot de passe.
  - **confirmPassword** \_(string, requis): la confirmation du nouveau mot de passe

#### Exemple de corps de requête :

```json
{
  "email": "example@gmail.com",
  "tokenString": "exempledetokenvalide",
  "password": "nouveauMotDePasse123!",
  "confirmPassword": "nouveauMotDePasse123!"
}
```

---

## 7. Envoi du lien de réinitialisation du mot de passe

- **Méthode**: `POST`
- **Endpoint**: `/send-reset-password-link`
- **Description**: Envoie un email contenant un lien pour réinitialiser le mot de passe.
- **Controller**: `TokenController.SendResetPasswordEmail`
- **Paramètres de requête**:
  - **email** _(string, requis)_: Adresse email de l'utilisateur pour laquelle le lien sera envoyé.

#### Exemple de corps de requête :

```json
{
  "email": "utilisateur@example.com"
}
```

## 4. Vérification du lien de réinitialisation du mot de passe

- **Méthode**: `POST`
- **Endpoint**: `/verify-reset-password-link`
- **Description**: Vérifie la validité du jeton contenu dans le lien de réinitialisation du mot de passe.
- **Controller**: `TokenController.VerifyResetPasswordToken`
- **Paramètres de requête**:
  - **tokenString** _(string, requis)_: Jeton envoyé dans le lien de réinitialisation.

#### Exemple de corps de requête :

```json
{
  "tokenString": "exempledetokenvalide"
}
```

## Protected routes

### **1. Create Application**

- **URL:** `POST /create-application`
- **Body:**
  ```json
  {
    "Url": "string, required",
    "Title": "string, required",
    "Company": "string, optional",
    "Applied": "boolean, optional (default: true)",
    "..."
  }
  ```
- **Response:**  
  Success: Application details (`200 OK`)  
  Error: Validation or auth errors (`4XX/5XX`)

### **2. Get All Applications**

- **URL:** `GET /get-applications-by-user`
- **Response:**  
  Success: List of user applications (`200 OK`)
  Example :

  ```json
  {
    "data": [
      {
        "id": 1,
        "user_id": 123,
        "url": "https://example.com/job",
        "title": "Software Engineer",
        "company": "Example Corp",
        "location": "New York, NY",
        "description": "Job description here...",
        "salary": "$100,000",
        "job_type": "Full-Time",
        "applied": true,
        "response": false,
        "follow_up": false,
        "created_at": "2024-04-27T10:00:00Z",
        "updated_at": "2024-04-27T10:00:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "page_size": 10,
      "total_pages": 5,
      "total_items": 50
    },
    "filter": {
      "title": "Engineer",
      "orderByCreatedAt": "desc",
      "status": {
        "applied": "true",
        "response": null,
        "followUp": "false"
      }
    }
  }
  ```

  Error: Not found or unauthorized (`404/403`)

### **3. Get Single Application**

- **URL:** `GET /applications/{id}`
- **Response:**
  Success: Application details (`200 OK`)
  Error: Not found or unauthorized (`404/403`)

### **4. Update Application**

- **URL:** `POST /update-application`
- **Body:**
  Optional fields like `Url`, `Title`, `Applied`, etc.
- **Response:**
  Success: Updated application (`200 OK`)
  Error: Auth or validation errors (`4XX`)

### **5. Delete Application**

- **URL:** `POST /delete-application`
- **Response:**
  Success: Deletion confirmation (`200 OK`)
  Error: Not found or unauthorized (`404/403`)

### **6. Update Application Status**

- **URL:** `POST /application-status-update`
- **Body:**
  Optional fields like `applied`, `followUp`, `response`, etc.
- **Response:**
  Success: Updated application (`200 OK`)
  Error: Auth or validation errors (`4XX`)

---

## Error Codes

- `400`: Validation error
- `401`: Authentication required
- `403`: Unauthorized access
- `404`: Application not found

---

```

```
