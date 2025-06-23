import { AirportRepository } from './airport.repository';
import { Airport } from '../models/airport.model';
import { ERROR_MESSAGES, REPOSITORY_STRINGS } from '../../infrastructure/constants';

jest.mock('../models/airport.model');

describe('AirportRepository', () => {
  let repository: AirportRepository;

  beforeEach(() => {
    repository = new AirportRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return airport data when found', async () => {
    const mockAirport = {
      _id: '123',
      name: 'Test Airport',
      iata_code: 'DEL',
      city_id: { _id: 'city123', name: 'Delhi' },
      country_id: { _id: 'country123', name: 'India' },
    };

    const execMock = jest.fn().mockResolvedValue(mockAirport);
    const populateSecondMock = jest.fn().mockReturnValue({ exec: execMock });
    const populateFirstMock = jest.fn().mockReturnValue({ populate: populateSecondMock });
    const findOneMock = jest.fn().mockReturnValue({ populate: populateFirstMock });

    (Airport.findOne as jest.Mock) = findOneMock;

    const result = await repository.findByIataCode('DEL');

    expect(Airport.findOne).toHaveBeenCalledWith({ [REPOSITORY_STRINGS.IATA_CODE_FIELD]: 'DEL' });
    expect(populateFirstMock).toHaveBeenCalledWith({
      path: REPOSITORY_STRINGS.CITY_ID_PATH,
      model: REPOSITORY_STRINGS.CITY_MODEL,
      localField: REPOSITORY_STRINGS.LOCAL_FIELD_CITY_ID,
      foreignField: REPOSITORY_STRINGS.FOREIGN_FIELD_ID,
    });
    expect(populateSecondMock).toHaveBeenCalledWith({
      path: REPOSITORY_STRINGS.COUNTRY_ID_PATH,
      model: REPOSITORY_STRINGS.COUNTRY_MODEL,
      localField: REPOSITORY_STRINGS.LOCAL_FIELD_COUNTRY_ID,
      foreignField: REPOSITORY_STRINGS.FOREIGN_FIELD_ID,
    });
    expect(execMock).toHaveBeenCalled();
    expect(result).toEqual(mockAirport);
  });

  it('should return null if airport not found', async () => {
    const execMock = jest.fn().mockResolvedValue(null);
    const populateSecondMock = jest.fn().mockReturnValue({ exec: execMock });
    const populateFirstMock = jest.fn().mockReturnValue({ populate: populateSecondMock });
    const findOneMock = jest.fn().mockReturnValue({ populate: populateFirstMock });

    (Airport.findOne as jest.Mock) = findOneMock;

    const result = await repository.findByIataCode('XYZ');

    expect(result).toBeNull();
  });

  it('should throw an error if database query fails', async () => {
    const error = new Error('DB connection failed');
    const execMock = jest.fn().mockRejectedValue(error);
    const populateSecondMock = jest.fn().mockReturnValue({ exec: execMock });
    const populateFirstMock = jest.fn().mockReturnValue({ populate: populateSecondMock });
    const findOneMock = jest.fn().mockReturnValue({ populate: populateFirstMock });

    (Airport.findOne as jest.Mock) = findOneMock;

    await expect(repository.findByIataCode('DEL')).rejects.toThrow(ERROR_MESSAGES.DATABASE_ERROR);
  });
});
