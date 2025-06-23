import { AirportUseCase } from '../usecases/airport.usecase';
import { Request, Response } from 'express';
import { HTTP_STATUS, ERROR_MESSAGES, CONTROLLER_STRINGS } from '../../infrastructure/constants';

/**
 * Controller for handling airport-related HTTP requests
 */
export class AirportController {
  private getAirportByIataCode: AirportUseCase;

  constructor() {
    this.getAirportByIataCode = new AirportUseCase();
  }

  /**
   * Handles GET request to retrieve airport details by IATA code
   * @param req - Express request object containing IATA code in params
   * @param res - Express response object
   * @returns Promise resolving to void
   */
  async getAirport(req: Request, res: Response): Promise<void> {
    try {
      const { [CONTROLLER_STRINGS.IATA_CODE_PARAM]: iata_code } = req.params;

      // Validate IATA code format (3 uppercase letters)
      if (!iata_code || !new RegExp(CONTROLLER_STRINGS.IATA_CODE_REGEX).test(iata_code)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({ [CONTROLLER_STRINGS.ERROR_KEY]: ERROR_MESSAGES.INVALID_IATA_CODE });
        return;
      }

      const result = await this.getAirportByIataCode.execute(iata_code);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      if (error instanceof Error && error.message === ERROR_MESSAGES.AIRPORT_NOT_FOUND) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ [CONTROLLER_STRINGS.ERROR_KEY]: error.message });
      } else {
        console.error(CONTROLLER_STRINGS.CONTROLLER_ERROR_LOG, error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ [CONTROLLER_STRINGS.ERROR_KEY]: ERROR_MESSAGES.SERVER_ERROR });
      }
    }
  }
}