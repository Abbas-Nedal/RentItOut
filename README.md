# RentItOut API

RentItOut is a peer-to-peer rental platform that allows users to list and rent everyday items like tools, sports equipment, and electronics. This project focuses on building the backend API for the platform.

## Features
- Item listings for rent
- Rental management and pricing
- User authentication and role-based access
- Trust, safety, and verification for users
- Delivery and pickup logistics for rented items


## Setup Instructions
- Clone the repository: `git clone https://github.com/Abbas-Nedal/RentItOut.git`
- Install dependencies: `npm install`
- Run the app: `npm start`


## Technologies

- **Node.js**: The runtime environment for executing JavaScript code on the server.
- **Express.js**: A web application framework for building APIs and handling HTTP requests.
- **MySQL**: The relational database used to store user, item, and rental data.
- **Winston**: A logging library used to log requests and other system events.
- **body-parser**: Middleware for parsing incoming request bodies in JSON format.
- **RESTful API**: The architectural style used for designing the API endpoints.




## Project Structure
RentItOut/
├── controllers/            # Contains logic for handling requests 
├── routes/                 # Contains API routes for different features 
├── database.js             # Database connection setup (MySQL)
├── config/                 # Contains configuration files
│   └── logger.js           # Logging configuration with Winston
├── logs/                   # Stores request logs
└── server.js               # Main application entry point


