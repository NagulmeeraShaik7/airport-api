import { AirportRepository } from '../repositories/airport.repository';
import { IAirport } from '../models/airport.model';
import { ERROR_MESSAGES, HTTP_STATUS } from '../../infrastructure/constants';

/**
 * Interface for airport response structure
 */
interface AirportResponse {
  airport: {
    id: number;
    icao_code: string;
    iata_code: string;
    name: string;
    type: string;
    latitude_deg: number;
    longitude_deg: number;
    elevation_ft: number | null;
    address: {
      city: {
        id: number;
        name: string;
        country_id: number;
        is_active: boolean;
        lat: number;
        long: number;
      } | null;
      country: {
        id: number;
        name: string;
        country_code_two: string;
        country_code_three: string;
        mobile_code: number;
        continent_id: number;
      } | null;
    };
  };
}

/**
 * Use case for airport business logic
 */
export class AirportUseCase {
  private airportRepository: AirportRepository;

  constructor() {
    this.airportRepository = new AirportRepository();
  }

  /**
   * Executes the use case to retrieve airport by IATA code
   * @param iataCode - The IATA code of the airport
   * @returns Promise resolving to formatted airport response
   * @throws Error if airport is not found or database error occurs
   */
  async execute(iataCode: string): Promise<AirportResponse> {
    try {
      const airport = await this.airportRepository.findByIataCode(iataCode);
      if (!airport) {
        throw new Error(ERROR_MESSAGES.AIRPORT_NOT_FOUND);
      }

      const city = airport.city_id
        ? {
            id: (airport.city_id as any).id,
            name: (airport.city_id as any).name,
            country_id: (airport.city_id as any).country_id,
            is_active: (airport.city_id as any).is_active,
            lat: (airport.city_id as any).lat,
            long: (airport.city_id as any).long,
          }
        : null;

      const country = airport.country_id
        ? {
            id: (airport.country_id as any).id,
            name: (airport.country_id as any).name,
            country_code_two: (airport.country_id as any).country_code_two,
            country_code_three: (airport.country_id as any).country_code_three,
            mobile_code: (airport.country_id as any).mobile_code,
            continent_id: (airport.country_id as any).continent_id,
          }
        : null;

      return {
        airport: {
          id: airport.id,
          icao_code: airport.icao_code,
          iata_code: airport.iata_code,
          name: airport.name,
          type: airport.type,
          latitude_deg: airport.latitude_deg,
          longitude_deg: airport.longitude_deg,
          elevation_ft: airport.elevation_ft || null,
          address: {
            city,
            country,
          },
        },
      };
    } catch (error) {
      if (error instanceof Error && error.message === ERROR_MESSAGES.DATABASE_ERROR) {
        throw error;
      }
      throw new Error(ERROR_MESSAGES.AIRPORT_NOT_FOUND);
    }
  }
}