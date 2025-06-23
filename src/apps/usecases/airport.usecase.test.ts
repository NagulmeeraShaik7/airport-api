import { AirportUseCase } from './airport.usecase';
import { AirportRepository } from '../repositories/airport.repository';
import { ERROR_MESSAGES } from '../../infrastructure/constants';
import { IAirport } from '../models/airport.model';
import { ICity } from '../models/city.model';
import { ICountry } from '../models/country.model';

jest.mock('../repositories/airport.repository');

describe('AirportUseCase', () => {
  let useCase: AirportUseCase;
  let mockFindByIataCode: jest.Mock;

  beforeEach(() => {
    mockFindByIataCode = jest.fn();

    (AirportRepository as jest.Mock).mockImplementation(() => ({
      findByIataCode: mockFindByIataCode,
    }));

    useCase = new AirportUseCase();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return formatted airport response when airport is found with city and country populated', async () => {
    // Define mock data for City and Country as Partial<ICity/ICountry>
    // Then cast them to ICity/ICountry using 'as ICity'/'as ICountry'
    // This tells TypeScript you're intentionally providing a subset of properties
    const mockCity: ICity = {
      id: 100,
      name: 'Bangalore',
      country_id: 10,
      is_active: true,
      lat: 12.97,
      long: 77.59,
      // Add other required properties that the AirportUseCase *actually uses*
      // If ICity has _id and your usecase accesses it, include it here, e.g.,
      // _id: 'mock_city_id_100',
      // If the use case only accesses id, name, etc., this is fine.
    } as ICity; // Cast to ICity

    const mockCountry: ICountry = {
      id: 10,
      name: 'India',
      country_code_two: 'IN',
      country_code_three: 'IND',
      mobile_code: 91,
      continent_id: 1,
      // Add other required properties that the AirportUseCase *actually uses*
      // _id: 'mock_country_id_10',
    } as ICountry; // Cast to ICountry

    // Define the mock Airport object.
    // Ensure city_id and country_id are the *full mock objects* here.
    const mockAirport: IAirport = {
      id: 1,
      icao_code: 'VOBL',
      iata_code: 'BLR',
      name: 'Kempegowda International Airport',
      type: 'large_airport',
      latitude_deg: 12.949999,
      longitude_deg: 77.668999,
      elevation_ft: 3000,
      city_id: mockCity,       // Populated city object
      country_id: mockCountry, // Populated country object
      continent_id: 1,
      created_at: new Date(),
      updated_at: new Date(),
      _id: 'mocked_airport_id', // Assuming IAirport also has _id
      timezone: 'Asia/Kolkata',
      is_active: true,
    } as unknown as IAirport; // Cast to unknown first, then to IAirport

    mockFindByIataCode.mockResolvedValue(mockAirport);

    const result = await useCase.execute('BLR');

    expect(mockFindByIataCode).toHaveBeenCalledWith('BLR');

    expect(result).toEqual({
      airport: {
        id: mockAirport.id,
        icao_code: mockAirport.icao_code,
        iata_code: mockAirport.iata_code,
        name: mockAirport.name,
        type: mockAirport.type,
        latitude_deg: mockAirport.latitude_deg,
        longitude_deg: mockAirport.longitude_deg,
        elevation_ft: mockAirport.elevation_ft,
        address: {
          city: {
            id: mockCity.id,
            name: mockCity.name,
            country_id: mockCity.country_id,
            is_active: mockCity.is_active,
            lat: mockCity.lat,
            long: mockCity.long,
          },
          country: {
            id: mockCountry.id,
            name: mockCountry.name,
            country_code_two: mockCountry.country_code_two,
            country_code_three: mockCountry.country_code_three,
            mobile_code: mockCountry.mobile_code,
            continent_id: mockCountry.continent_id,
          },
        },
      },
    });
  });

  it('should return formatted airport response with null city and country if they are not populated', async () => {
    const mockAirportWithoutRelations = {
      id: 2,
      icao_code: 'VABM',
      iata_code: 'BOM',
      name: 'Chhatrapati Shivaji Maharaj International Airport',
      type: 'large_airport',
      latitude_deg: 19.09,
      longitude_deg: 72.87,
      elevation_ft: 37,
      city_id: null, // Explicitly null for testing this scenario
      country_id: null, // Explicitly null for testing this scenario
      continent_id: 1,
      created_at: new Date(),
      updated_at: new Date(),
      _id: 'mocked_airport_id_2', // Assuming IAirport also has _id
      timezone: 'Asia/Kolkata',
      is_active: true,
    } as unknown as IAirport; // Cast to unknown first, then to IAirport

    mockFindByIataCode.mockResolvedValue(mockAirportWithoutRelations);

    const result = await useCase.execute('BOM');

    expect(mockFindByIataCode).toHaveBeenCalledWith('BOM');
    expect(result).toEqual({
      airport: {
        id: mockAirportWithoutRelations.id,
        icao_code: mockAirportWithoutRelations.icao_code,
        iata_code: mockAirportWithoutRelations.iata_code,
        name: mockAirportWithoutRelations.name,
        type: mockAirportWithoutRelations.type,
        latitude_deg: mockAirportWithoutRelations.latitude_deg,
        longitude_deg: mockAirportWithoutRelations.longitude_deg,
        elevation_ft: mockAirportWithoutRelations.elevation_ft,
        address: {
          city: null,
          country: null,
        },
      },
    });
  });

  it('should throw AIRPORT_NOT_FOUND error when airport not found', async () => {
    mockFindByIataCode.mockResolvedValue(null);

    await expect(useCase.execute('XYZ')).rejects.toThrow(ERROR_MESSAGES.AIRPORT_NOT_FOUND);
    expect(mockFindByIataCode).toHaveBeenCalledWith('XYZ');
  });

  it('should throw DATABASE_ERROR if repository throws a database error', async () => {
    const dbError = new Error(ERROR_MESSAGES.DATABASE_ERROR);
    mockFindByIataCode.mockRejectedValue(dbError);

    await expect(useCase.execute('DEL')).rejects.toThrow(ERROR_MESSAGES.DATABASE_ERROR);
    expect(mockFindByIataCode).toHaveBeenCalledWith('DEL');
  });

  it('should throw AIRPORT_NOT_FOUND if repository throws a generic error (not a DATABASE_ERROR)', async () => {
    const genericError = new Error('Unexpected network failure');
    mockFindByIataCode.mockRejectedValue(genericError);

    await expect(useCase.execute('DEL')).rejects.toThrow(ERROR_MESSAGES.AIRPORT_NOT_FOUND);
    expect(mockFindByIataCode).toHaveBeenCalledWith('DEL');
  });
});