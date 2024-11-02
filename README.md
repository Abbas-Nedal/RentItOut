# RentItOut API

RentItOut is a peer-to-peer rental platform that allows users to list and rent everyday items like tools, sports equipment, and electronics. This project focuses on building the backend API for the platform.

## Features
- Item listings for rent
- Rental management and pricing
- User authentication and role-based access
- Trust, safety, and verification for users
- Delivery and pickup logistics for rented items
- Automatic API documentation using Swagger

## Setup Instructions
- Clone the repository: git clone https://github.com/Abbas-Nedal/RentItOut.git
- Install dependencies: npm install
- Run the app: npm start

## Accessing API Documentation
After starting the application, you can access the API documentation at: http://localhost:3000/api-docs

## Technologies
- **Node.js**: The runtime environment for executing JavaScript code on the server.
- **Express.js**: A web application framework for building APIs and handling HTTP requests.
- **MySQL**: The relational database used to store user, item, and rental data (hosted on AWS RDS).
- **AWS**: Amazon Web Services, used for hosting the MySQL database on Amazon RDS for reliable and scalable cloud database management.
- **Docker**: A containerization tool that simplifies the deployment process by packaging the application and its dependencies into a container.
- **Winston**: A logging library used to log requests and other system events.
- **body-parser**: Middleware for parsing incoming request bodies in JSON format.
- **Swagger**: A tool for auto-generating API documentation and testing endpoints.
- **RESTful API**: The architectural style used for designing the API endpoints.
- **Express-validator**: Middleware for validating request bodies.
- **Nodemailer**: A module for sending emails from Node.js applications.
- **dotenv**: Module for loading environment variables from a `.env` file.
- **jsonwebtoken**: Library to create and verify JSON Web Tokens (JWT) for authentication.

## Project Structure

📦 RentItOut<br>
 ┣ 📂 config               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # Configuration settings<br>
 ┣ 📂 controllers          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # Contains request-handling logic<br>
 ┣ 📂 logs-output          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # Stores logs output<br>
 ┣ 📂 middlewares          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # Middleware functions for processing requests<br>
 ┣ 📂 models               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # Database models, SQL query logic<br>
 ┣ 📂 routes               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # API route definitions<br>
 ┣ 📂 services             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # Business logic, external API handling, mail service<br>
 ┣ 📂 validations          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # Request validation logic<br>
 ┣ 📜 .dockerignore<br>
 ┣ 📜 .env<br>
 ┣ 📜 .gitignore<br>
 ┣ 📜 database.js          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # Database connection and initialization<br>
 ┣ 📜 docker-compose.yml<br>
 ┣ 📜 Dockerfile<br>
 ┣ 📜 package-lock.json<br>
 ┣ 📜 package.json<br>
 ┣ 📜 README.md<br>
 ┣ 📜 server.js            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # Entry point for the server<br>
 ┣ 📜 swagger-output.json<br>
 ┗ 📜 swagger.js           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # Swagger configuration<br>


