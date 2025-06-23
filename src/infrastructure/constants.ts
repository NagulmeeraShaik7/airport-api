/**
 * @file constants.ts
 * @module infrastructure/constants
 * @description Defines constants used throughout the airport API application, including HTTP status codes, error messages, API paths, and specific strings for controllers, repositories, data sources, and server initialization.
 */

/**
 * HTTP status codes used in API responses
 * @constant
 * @property {number} OK - Success status code (200)
 * @property {number} BAD_REQUEST - Bad request status code (400)
 * @property {number} NOT_FOUND - Not found status code (404)
 * @property {number} INTERNAL_SERVER_ERROR - Internal server error status code (500)
 */
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Error messages used across the application
 * @constant
 * @property {string} INVALID_IATA_CODE - Error message for invalid IATA code format
 * @property {string} AIRPORT_NOT_FOUND - Error message when an airport is not found
 * @property {string} DATABASE_ERROR - Error message for database operation failures
 * @property {string} SERVER_ERROR - Error message for generic server errors
 * @property {string} MONGO_URI_NOT_DEFINED - Error message when MONGO_URI is not defined
 * @property {string} EXCEL_SHEETS_NOT_FOUND - Error message when required Excel sheets are missing
 * @property {string} UNEXPECTED_ERROR - Error message for unexpected server errors
 */
export const ERROR_MESSAGES = {
  INVALID_IATA_CODE: 'Invalid IATA code provided',
  AIRPORT_NOT_FOUND: 'Airport not found',
  DATABASE_ERROR: 'Database operation failed',
  SERVER_ERROR: 'Internal server error',
  MONGO_URI_NOT_DEFINED: 'MONGO_URI is not defined in the .env file',
  EXCEL_SHEETS_NOT_FOUND: 'Error: One or more required sheets (airports, cities, countries) not found in Database.xlsx',
  UNEXPECTED_ERROR: 'An unexpected error occurred.',
} as const;

/**
 * API path definitions for routing
 * @constant
 * @property {string} AIRPORT_BY_IATA - Path for retrieving airport by IATA code
 * @property {string} API_BASE - Base path for API routes
 * @property {string} SWAGGER_DOCS - Path for Swagger documentation
 */
export const API_PATHS = {
  AIRPORT_BY_IATA: '/airports/:iata_code',
  API_BASE: '/api',
  SWAGGER_DOCS: '/api-docs',
} as const;

/**
 * String constants used in the airport controller
 * @constant
 * @property {string} IATA_CODE_PARAM - Parameter name for IATA code in requests
 * @property {string} ERROR_KEY - Key for error messages in JSON responses
 * @property {string} CONTROLLER_ERROR_LOG - Prefix for controller error logs
 * @property {string} IATA_CODE_REGEX - Regex pattern for validating IATA codes (3 uppercase letters)
 */
export const CONTROLLER_STRINGS = {
  IATA_CODE_PARAM: 'iata_code',
  ERROR_KEY: 'error',
  CONTROLLER_ERROR_LOG: 'Controller Error:',
  IATA_CODE_REGEX: '^[A-Z]{3}$',
} as const;

/**
 * String constants used in the airport repository
 * @constant
 * @property {string} IATA_CODE_FIELD - Field name for IATA code in database queries
 * @property {string} CITY_ID_PATH - Path for city ID in population queries
 * @property {string} CITY_MODEL - Model name for City in population queries
 * @property {string} LOCAL_FIELD_CITY_ID - Local field for city ID in population queries
 * @property {string} FOREIGN_FIELD_ID - Foreign field for ID in population queries
 * @property {string} COUNTRY_ID_PATH - Path for country ID in population queries
 * @property {string} COUNTRY_MODEL - Model name for Country in population queries
 * @property {string} LOCAL_FIELD_COUNTRY_ID - Local field for country ID in population queries
 * @property {string} REPOSITORY_ERROR_LOG - Prefix for repository error logs
 */
export const REPOSITORY_STRINGS = {
  IATA_CODE_FIELD: 'iata_code',
  CITY_ID_PATH: 'city_id',
  CITY_MODEL: 'City',
  LOCAL_FIELD_CITY_ID: 'city_id',
  FOREIGN_FIELD_ID: 'id',
  COUNTRY_ID_PATH: 'country_id',
  COUNTRY_MODEL: 'Country',
  LOCAL_FIELD_COUNTRY_ID: 'country_id',
  REPOSITORY_ERROR_LOG: 'Repository Error:',
} as const;

/**
 * String constants used in the data source module
 * @constant
 * @property {string} MONGO_URI_ENV - Environment variable name for MongoDB URI
 * @property {string} MONGO_CONNECTION_SUCCESS - Success message for MongoDB connection
 * @property {string} MONGO_CONNECTION_ERROR_LOG - Prefix for MongoDB connection error logs
 * @property {string} MONGO_DISCONNECTION_SUCCESS - Success message for MongoDB disconnection
 * @property {string} MONGO_DISCONNECTION_ERROR_LOG - Prefix for MongoDB disconnection error logs
 */
export const DATA_SOURCE_STRINGS = {
  MONGO_URI_ENV: 'MONGO_URI',
  MONGO_CONNECTION_SUCCESS: 'MongoDB connected successfully',
  MONGO_CONNECTION_ERROR_LOG: 'MongoDB connection error:',
  MONGO_DISCONNECTION_SUCCESS: 'MongoDB disconnected',
  MONGO_DISCONNECTION_ERROR_LOG: 'MongoDB disconnection error:',
} as const;

/**
 * String constants used in the server initialization (index)
 * @constant
 * @property {string} PORT_ENV - Environment variable name for server port
 * @property {string} DEFAULT_PORT - Default port number if not specified
 * @property {string} DATA_EXISTS_LOG - Log message when data already exists in database
 * @property {string} IMPORTING_DATA_LOG - Log message when starting data import from Excel
 * @property {string} EXCEL_FILE_PATH - File path for the Excel database file
 * @property {string} AIRPORTS_SHEET - Name of the airports sheet in Excel
 * @property {string} CITIES_SHEET - Name of the cities sheet in Excel
 * @property {string} COUNTRIES_SHEET - Name of the countries sheet in Excel
 * @property {string} ID_FIELD - Field name for ID in database operations
 * @property {string} COUNTRY_ID_FIELD - Field name for country ID in database operations
 * @property {string} CONTINENT_ID_FIELD - Field name for continent ID in database operations
 * @property {string} MOBILE_CODE_FIELD - Field name for mobile code in database operations
 * @property {string} ELEVATION_FT_FIELD - Field name for elevation in feet in database operations
 * @property {string} IS_ACTIVE_FIELD - Field name for is_active in database operations
 * @property {string} LATITUDE_DEG_FIELD - Field name for latitude in degrees in database operations
 * @property {string} LONGITUDE_DEG_FIELD - Field name for longitude in degrees in database operations
 * @property {string} LAT_FIELD - Field name for latitude in database operations
 * @property {string} LONG_FIELD - Field name for longitude in database operations
 * @property {string} CREATED_AT_FIELD - Field name for created_at in database operations
 * @property {string} UPDATED_AT_FIELD - Field name for updated_at in database operations
 * @property {string} TRUE_STRING - String value for true in database operations
 * @property {string} TRUE_CAPITALIZED - Capitalized string value for True in database operations
 * @property {string} COUNTRIES_IMPORTED_LOG - Log message for successful country imports
 * @property {string} CITIES_IMPORTED_LOG - Log message for successful city imports
 * @property {string} AIRPORTS_IMPORTED_LOG - Log message for successful airport imports
 * @property {string} DATA_IMPORTED_SUCCESS_LOG - Log message for successful data import
 * @property {string} DATA_IMPORT_ERROR_LOG - Prefix for data import error logs
 * @property {string} JSON_MIDDLEWARE - Express middleware method for JSON parsing
 * @property {string} SERVER_RUNNING_LOG - Prefix for server running log message
 * @property {string} SWAGGER_DOCS_LOG - Prefix for Swagger docs log message
 * @property {string} STARTUP_ERROR_LOG - Prefix for startup error logs
 * @property {string} ERROR_STACK_LOG - Key for error stack logging and JSON responses
 */
export const INDEX_STRINGS = {
  PORT_ENV: 'PORT',
  DEFAULT_PORT: '3000',
  DATA_EXISTS_LOG: 'Data already exists, skipping import',
  IMPORTING_DATA_LOG: 'Importing data from Database.xlsx...',
  EXCEL_FILE_PATH: './Database.xlsx',
  AIRPORTS_SHEET: 'airports',
  CITIES_SHEET: 'cities',
  COUNTRIES_SHEET: 'countries',
  ID_FIELD: 'id',
  COUNTRY_ID_FIELD: 'country_id',
  CONTINENT_ID_FIELD: 'continent_id',
  MOBILE_CODE_FIELD: 'mobile_code',
  ELEVATION_FT_FIELD: 'elevation_ft',
  IS_ACTIVE_FIELD: 'is_active',
  LATITUDE_DEG_FIELD: 'latitude_deg',
  LONGITUDE_DEG_FIELD: 'longitude_deg',
  LAT_FIELD: 'lat',
  LONG_FIELD: 'long',
  CREATED_AT_FIELD: 'created_at',
  UPDATED_AT_FIELD: 'updated_at',
  TRUE_STRING: 'true',
  TRUE_CAPITALIZED: 'True',
  COUNTRIES_IMPORTED_LOG: 'Countries imported',
  CITIES_IMPORTED_LOG: 'Cities imported',
  AIRPORTS_IMPORTED_LOG: 'Airports imported',
  DATA_IMPORTED_SUCCESS_LOG: 'Data imported successfully',
  DATA_IMPORT_ERROR_LOG: 'Data Import Error:',
  JSON_MIDDLEWARE: 'json',
  SERVER_RUNNING_LOG: 'Server running at http://localhost:',
  SWAGGER_DOCS_LOG: 'Swagger docs available at http://localhost:',
  STARTUP_ERROR_LOG: 'Startup Error:',
  ERROR_STACK_LOG: 'error',
} as const;

/**
 * CORS configuration for the application
 * @constant
 * @property {string} ALLOWED_ORIGINS - Comma-separated list of allowed origins for CORS
 * @property {string[]} ALLOWED_METHODS - Array of allowed HTTP methods for CORS  
 * @property {string[]} ALLOWED_HEADERS - Array of allowed headers for CORS
 */
export const CORS_CONFIG = {
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || 'http://localhost:3000,https://airport-api-erqf.onrender.com',
  ALLOWED_METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  ALLOWED_HEADERS: ['Content-Type', 'Authorization'],
};