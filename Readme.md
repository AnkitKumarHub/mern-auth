# MERN Authenticator Project

This project is a MERN (MongoDB, Express.js, React, Node.js) stack application that provides user authentication functionality. It is designed to help developers quickly integrate authentication features into their applications.

## Features

- **User Registration**: Allows new users to create an account by providing their details.
- **User Login**: Enables existing users to log in using their credentials.
- **Logout**: Allows users to securely log out of their accounts.
- **Account Verification**: Sends verification emails to users to confirm their email addresses.
- **Password Reset**: Enables users to reset their passwords if they forget them.
- **Password Encryption**: Ensures user passwords are securely stored using encryption techniques.
- **JWT Authentication**: Utilizes JSON Web Tokens (JWT) for secure user authentication and session management.
- **Protected Routes**: Restricts access to certain routes based on user authentication status.
- **Rate Limiting**: Protects the application from brute-force attacks by limiting login attempts.
- **Social Login**: Allows users to log in using their social media accounts (e.g., Google, Facebook).
- **Email Notifications**: Sends email notifications for important events, such as logins from new devices or password changes.
- **Error Handling**: Provides comprehensive error handling for various authentication-related issues.

## Technologies Used

- **MongoDB**: Database for storing user information.
- **Express.js**: Backend framework for handling API requests.
- **React**: Frontend library for building user interfaces.
- **Node.js**: Runtime environment for executing server-side code.

## Getting Started

To get started with this project, follow the instructions below:

1. Clone the repository.
    ```bash
   git clone https://github.com/AnkitKumarHub/mern-auth.git

2. Navigate to the project directory.
3. Install the necessary dependencies.
    ```bash
    npm install
4. Set up environment variables for database connection, JWT secret, and email service.
5. Run the application:
    ```bash
    npm start

## Usage

1. Register a new account or log in with existing credentials.
2. Verify your email address using the verification link sent to your email.
3. Access protected routes and manage your profile.
4. Use the password reset feature if you forget your password.

## Environment Variables

Ensure you have the following environment variables set up in your `.env` file:

- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key for JWT.
- `EMAIL_SERVICE`: Email service provider (e.g., Gmail, SendGrid).
- `SMTP_USER`: Email service username.
- `SMTP_PASS`: Email service password.
- `SENDER_EMAIL`: Email account used to send mails.
- `VITE_BACKEND_URL`: URL of the backend application.


## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

