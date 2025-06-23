import { Airport, IAirport } from '../models/airport.model';
import { HTTP_STATUS, ERROR_MESSAGES, REPOSITORY_STRINGS } from '../../infrastructure/constants';

/**
 * Repository for airport data operations
 */
export class AirportRepository {
  /**
   * Finds an airport by its IATA code with populated city and country data
   * @param iataCode - The IATA code of the airport
   * @returns Promise resolving to airport document or null
   * @throws Error if database operation fails
   */
  async findByIataCode(iataCode: string): Promise<IAirport | null> {
    try {
      return await Airport.findOne({ [REPOSITORY_STRINGS.IATA_CODE_FIELD]: iataCode })
        .populate({
          path: REPOSITORY_STRINGS.CITY_ID_PATH,
          model: REPOSITORY_STRINGS.CITY_MODEL,
          localField: REPOSITORY_STRINGS.LOCAL_FIELD_CITY_ID,
          foreignField: REPOSITORY_STRINGS.FOREIGN_FIELD_ID,
        })
        .populate({
          path: REPOSITORY_STRINGS.COUNTRY_ID_PATH,
          model: REPOSITORY_STRINGS.COUNTRY_MODEL,
          localField: REPOSITORY_STRINGS.LOCAL_FIELD_COUNTRY_ID,
          foreignField: REPOSITORY_STRINGS.FOREIGN_FIELD_ID,
        })
        .exec();
    } catch (error) {
      console.error(REPOSITORY_STRINGS.REPOSITORY_ERROR_LOG, error);
      throw new Error(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
}