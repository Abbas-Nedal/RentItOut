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

RentItOut/<br>
├── controllers/    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    # Contains logic for handling requests<br>
├── routes/         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    # Contains API routes for different features<br>
├── database.js     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    # Database connection setup (MySQL)<br>
├── config/         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    # Contains configuration files<br>
├── services/       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    # Contains project services (e.g. mail service)<br>
├── Middlewares/    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    # Contains Middlewars (e.g. authantication and roles middlewares)<br>
├── Validations/       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  # Contains validations scripts<br>
├── logs-out/       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    # Stores request logs<br>
├── server.js       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    # Main application entry point<br>
├── swagger.js      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    # Configures Swagger for API documentation and serves the docs<br>
├── swagger-output.json  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    # Generated Swagger documentation output in JSON format<br>
├── Dockerfile      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;     # Docker configuration for building the project container
├── docker-compose.yml  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;     # Docker Compose file for orchestrating multi-container deployment


