import express, { Express, Request, Response, NextFunction } from 'express';
import { connectDB } from './src/data-source';
import airportRoutes from './src/apps/routers/airport.route';
import dotenv from 'dotenv';
import { Airport } from './src/apps/models/airport.model';
import { City } from './src/apps/models/city.model';
import { Country } from './src/apps/models/country.model';
import * as path from 'path';
import * as XLSX from 'xlsx';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/infrastructure/swaggerConfig';
import cors from 'cors';
import { HTTP_STATUS, ERROR_MESSAGES, API_PATHS, INDEX_STRINGS, CORS_CONFIG } from './src/infrastructure/constants';

dotenv.config();

/**
 * Express application instance
 */
const app: Express = express();

/**
 * Server port number
 */
const PORT: number = parseInt(process.env[INDEX_STRINGS.PORT_ENV] || INDEX_STRINGS.DEFAULT_PORT, 10);

/**
 * Configures CORS middleware
 */
app.use(cors({
  origin: CORS_CONFIG.ALLOWED_ORIGINS.split(','),
  methods: CORS_CONFIG.ALLOWED_METHODS,
  allowedHeaders: CORS_CONFIG.ALLOWED_HEADERS,
}));

/**
 * Configures Express middleware
 */
app.use(express[INDEX_STRINGS.JSON_MIDDLEWARE]());

/**
 * Sets up Swagger UI
 */
app.use(API_PATHS.SWAGGER_DOCS, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * Imports data from Excel file into MongoDB
 * @returns Promise resolving to void
 */
const importData = async () => {
  try {
    const countryCount = await Country.countDocuments();
    if (countryCount > 0) {
      console.log(INDEX_STRINGS.DATA_EXISTS_LOG);
      return;
    }

    console.log(INDEX_STRINGS.IMPORTING_DATA_LOG);

    const excelFilePath = path.resolve(__dirname, INDEX_STRINGS.EXCEL_FILE_PATH);
    const workbook = XLSX.readFile(excelFilePath);

    const airportSheet = workbook.Sheets[INDEX_STRINGS.AIRPORTS_SHEET];
    const citySheet = workbook.Sheets[INDEX_STRINGS.CITIES_SHEET];
    const countrySheet = workbook.Sheets[INDEX_STRINGS.COUNTRIES_SHEET];

    if (!airportSheet || !citySheet || !countrySheet) {
      console.error(ERROR_MESSAGES.EXCEL_SHEETS_NOT_FOUND);
      process.exit(1);
    }

    const airports = XLSX.utils.sheet_to_json<any>(airportSheet);
    const cities = XLSX.utils.sheet_to_json<any>(citySheet);
    const countries = XLSX.utils.sheet_to_json<any>(countrySheet);

    const castValue = (value: any, key: string) => {
      if (typeof value === 'string') {
        value = value.trim();
      }

      if (([
        INDEX_STRINGS.ID_FIELD,
        INDEX_STRINGS.COUNTRY_ID_FIELD,
        INDEX_STRINGS.CONTINENT_ID_FIELD,
        INDEX_STRINGS.MOBILE_CODE_FIELD,
        INDEX_STRINGS.ELEVATION_FT_FIELD,
      ] as string[]).includes(key)) {
        return value ? Number(value) : null;
      }
      if (key === INDEX_STRINGS.IS_ACTIVE_FIELD) {
        return value === true || value === INDEX_STRINGS.TRUE_STRING || value === INDEX_STRINGS.TRUE_CAPITALIZED || value === 1;
      }
      if (([
        INDEX_STRINGS.LATITUDE_DEG_FIELD,
        INDEX_STRINGS.LONGITUDE_DEG_FIELD,
        INDEX_STRINGS.LAT_FIELD,
        INDEX_STRINGS.LONG_FIELD,
      ] as readonly string[]).includes(key)) {
        return value ? parseFloat(value) : null;
      }
      if (([INDEX_STRINGS.CREATED_AT_FIELD, INDEX_STRINGS.UPDATED_AT_FIELD] as string[]).includes(key)) {
        return value ? new Date(value) : new Date();
      }
      return value;
    };

    const countryPromises = countries.map(async (country: any) => {
      const processedCountry: { [key: string]: any } = {};
      for (const key in country) {
        processedCountry[key] = castValue(country[key], key);
      }
      return Country.updateOne(
        { [INDEX_STRINGS.ID_FIELD]: processedCountry[INDEX_STRINGS.ID_FIELD] },
        { $set: processedCountry },
        { upsert: true }
      );
    });
    await Promise.all(countryPromises);
    console.log(INDEX_STRINGS.COUNTRIES_IMPORTED_LOG);

    const cityPromises = cities.map(async (city: any) => {
      const processedCity: { [key: string]: any } = {};
      for (const key in city) {
        processedCity[key] = castValue(city[key], key);
      }
      return City.updateOne(
        { [INDEX_STRINGS.ID_FIELD]: processedCity[INDEX_STRINGS.ID_FIELD] },
        { $set: processedCity },
        { upsert: true }
      );
    });
    await Promise.all(cityPromises);
    console.log(INDEX_STRINGS.CITIES_IMPORTED_LOG);

    const airportPromises = airports.map(async (airport: any) => {
      const processedAirport: { [key: string]: any } = {};
      for (const key in airport) {
        processedAirport[key] = castValue(airport[key], key);
      }
      return Airport.updateOne(
        { [INDEX_STRINGS.ID_FIELD]: processedAirport[INDEX_STRINGS.ID_FIELD] },
        { $set: processedAirport },
        { upsert: true }
      );
    });
    await Promise.all(airportPromises);
    console.log(INDEX_STRINGS.AIRPORTS_IMPORTED_LOG);

    console.log(INDEX_STRINGS.DATA_IMPORTED_SUCCESS_LOG);
  } catch (error) {
    console.error(INDEX_STRINGS.DATA_IMPORT_ERROR_LOG, error);
  }
};

/**
 * Starts the Express server
 * @returns Promise resolving to void
 */
const startServer = async () => {
  try {
    await connectDB();
    await importData();
    const airportRouter = airportRoutes;

    app.use(API_PATHS.API_BASE, airportRouter);

    // Error handling middleware
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error(INDEX_STRINGS.ERROR_STACK_LOG, err.stack);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        [INDEX_STRINGS.ERROR_STACK_LOG]: ERROR_MESSAGES.UNEXPECTED_ERROR,
      });
    });

    app.listen(PORT, () => {
      console.log(`${INDEX_STRINGS.SERVER_RUNNING_LOG} ${PORT}`);
      console.log(`${INDEX_STRINGS.SWAGGER_DOCS_LOG}${PORT}${API_PATHS.SWAGGER_DOCS}`);
    });
  } catch (error) {
    console.error(INDEX_STRINGS.STARTUP_ERROR_LOG, error);
    process.exit(1);
  }
};

startServer();