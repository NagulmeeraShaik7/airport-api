import { Request, Response } from 'express';
import { AirportController } from './airport.controller';
import { AirportUseCase } from '../usecases/airport.usecase';
import { HTTP_STATUS, ERROR_MESSAGES, CONTROLLER_STRINGS } from '../../infrastructure/constants';

jest.mock('../usecases/airport.usecase');

describe('AirportController', () => {
  let controller: AirportController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    controller = new AirportController();

    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockResponse = {
      status: statusMock,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if iata_code is invalid', async () => {
    mockRequest = {
      params: {
        [CONTROLLER_STRINGS.IATA_CODE_PARAM]: 'XYZ123', // invalid
      },
    };

    await controller.getAirport(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
    expect(jsonMock).toHaveBeenCalledWith({
      [CONTROLLER_STRINGS.ERROR_KEY]: ERROR_MESSAGES.INVALID_IATA_CODE,
    });
  });

  it('should return 200 and airport data for valid iata_code', async () => {
    const iataCode = 'DEL';
    const airportData = { id: 1, name: 'Indira Gandhi International Airport', iata_code: 'DEL' };

    (AirportUseCase.prototype.execute as jest.Mock).mockResolvedValue(airportData);

    mockRequest = {
      params: {
        [CONTROLLER_STRINGS.IATA_CODE_PARAM]: iataCode,
      },
    };

    await controller.getAirport(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(jsonMock).toHaveBeenCalledWith(airportData);
    expect(AirportUseCase.prototype.execute).toHaveBeenCalledWith(iataCode);
  });

  it('should return 404 if airport not found', async () => {
    const iataCode = 'ZZZ';

    (AirportUseCase.prototype.execute as jest.Mock).mockRejectedValue(
      new Error(ERROR_MESSAGES.AIRPORT_NOT_FOUND)
    );

    mockRequest = {
      params: {
        [CONTROLLER_STRINGS.IATA_CODE_PARAM]: iataCode,
      },
    };

    await controller.getAirport(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
    expect(jsonMock).toHaveBeenCalledWith({
      [CONTROLLER_STRINGS.ERROR_KEY]: ERROR_MESSAGES.AIRPORT_NOT_FOUND,
    });
  });

  it('should return 500 on unknown server error', async () => {
    const iataCode = 'BOM';

    (AirportUseCase.prototype.execute as jest.Mock).mockRejectedValue(
      new Error('Unexpected error')
    );

    mockRequest = {
      params: {
        [CONTROLLER_STRINGS.IATA_CODE_PARAM]: iataCode,
      },
    };

    await controller.getAirport(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    expect(jsonMock).toHaveBeenCalledWith({
      [CONTROLLER_STRINGS.ERROR_KEY]: ERROR_MESSAGES.SERVER_ERROR,
    });
  });
});
