# Airport Information API

## Project Overview

This is a RESTful API built with Node.js, Express, and TypeScript, designed to provide comprehensive information about airports. It retrieves airport details, including associated city and country data, from a single Excel spreadsheet (`Database.xlsx`) and stores it in a MongoDB database. The API features robust data import, error handling, and automatically generated API documentation using Swagger.

## Features

* **Airport Lookup:** Retrieve detailed information about an airport using its IATA code.
* **Data Import:** Automatically imports and upserts (updates existing or inserts new) airport, city, and country data from `Database.xlsx` into MongoDB on application startup. This process is optimized for speed and skips if data already exists.
* **Structured Data:** Provides nested `city` and `country` information within the airport details.
* **Error Handling:** Implements global error middleware for consistent error responses.
* **API Documentation (Swagger):** Automatically generates and serves interactive API documentation.
* **Unit Testing:** Includes unit tests to ensure core logic and API endpoints function as expected.

## Technologies Used

* **Backend:** Node.js, Express.js
* **Language:** TypeScript
* **Database:** MongoDB
* **ORM/ODM:** Mongoose
* **Data Parsing:** `xlsx` (for Excel file reading)
* **Environment Variables:** `dotenv`
* **API Documentation:** `swagger-ui-express`, `swagger-jsdoc`
* **Testing:** Jest, Supertest
* **Development Tools:** Nodemon, ESLint, Prettier

## Project Structure 

```
├── src/
│   ├── apps/
│   │   ├── controllers/
│   │   │   └── airport.controller.ts
│   │   ├── models/
│   │   │   ├── airport.model.ts
│   │   │   ├── city.model.ts
│   │   │   └── country.model.ts
│   │   ├── repositories/
│   │   │   └── airport.repository.ts
│   │   ├── routers/
│   │   │   └── airport.route.ts
│   │   └── usecases/
│   │       └── airport.usecase.ts
│   └── data-source.ts
├── Database.xlsx             # The primary data source file
├── .env.example              # Example environment variables
├── .env                      # Your actual environment variables (created from .env.example)
├── index.ts                  # Main application entry point and data import logic
├── package.json              # Project dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── README.md                 # This file
├── jest.config.ts            # Jest configuration
└── tests/                    # Folder for unit/integration tests
└── ...
```

## Setup and Installation

Follow these steps to get the project running on your local machine.

### 1. Prerequisites

* Node.js (LTS version recommended)
* npm (comes with Node.js)
* MongoDB installed and running, or access to a MongoDB Atlas cluster.

### 2. Clone the Repository

```bash
git clone <https://github.com/NagulmeeraShaik7/airport-api>
cd airport-api # Or the name of your project folder
``` 

## Environment Variables
Create a `.env ` file in the root directory of your project. 

```

PORT=3000
MONGO_URI=mongodb://localhost:27017/airportdb # e.g., mongodb://localhost:27017/my_airport_db
 ``` 


## Run the Application

Start the server. The `importData` function will automatically run on startup, importing data from `Database.xlsx` if the database is empty. 

`Run command` : `npm start` 

## Install Dependencies command

`npm install` 


## API Endpoints
The API serves information about airports.

1. Get Airport by IATA Code
Retrieves detailed information for a specific airport, including its associated city and country.

      * **URL :**  `/api/airport/:iata_code`
      * **Method :** `GET`
      * **URL Parameters:**
         * `iata_code:` The IATA code of the airport (e.g., AGR).
* **Success Response (200 OK):** 

`JSON:` 

```
{
    "airport": {
        "id": 145,
        "icao_code": "VIAG",
        "iata_code": "AGR",
        "name": "Agra Airport / Agra Air Force Station",
        "type": "medium_airport",
        "latitude_deg": 27.157683,
        "longitude_deg": 77.960942,
        "elevation_ft": 551,
        "address": {
            "city": {
                "id": 436,
                "name": "Agra",
                "country_id": 76,
                "is_active": true,
                "lat": 27.18,
                "long": 78.02
            },
            "country": {
                "id": 76,
                "name": "India",
                "country_code_two": "IN",
                "country_code_three": "IND",
                "mobile_code": 91,
                "continent_id": 1
            }
        }
    }
}
``` 



* **Error Responses (404 Not Found):** 

```
{
    "error": "Airport not found"
}

```
* **Error Responses (500 Internal Server Error):**

```
{
    "message": "An unexpected error occurred.",
    "error": "Details of the error"
} 
```

* ## API Documentation (Swagger)
* Interactive API documentation is available via Swagger UI.

* `Access URL`: Once the server is running, open your browser and navigate to:` http://localhost:<PORT>/api-docs (e.g., http://localhost:3000/api-docs)`
This page will provide a user-friendly interface to explore the API endpoints, view request/response schemas, and even make test requests directly from the browser. 

## Running Unit Tests
To run the unit tests, execute the following command in the terminal:

To ensure the reliability and correctness of the API's core logic and endpoints, unit tests are included.

To run the tests, execute the following command in your project's root directory:

* For all test files run command

    `npx jest ` 

* For specific test file run command 
  `npx jest <copy relative path>` 

  
