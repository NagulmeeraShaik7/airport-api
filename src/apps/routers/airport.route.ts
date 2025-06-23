import { Router } from 'express';
import { AirportController } from '../controllers/airport.controller';
import { API_PATHS } from '../../infrastructure/constants';

/**
 * Configures Express routes for airport-related endpoints
 */
const router = Router();
const airportController = new AirportController();

/**
 * @swagger
 * /api/airports/{iata_code}:
 *   get:
 *     summary: Get airport details by IATA code
 *     tags: [Airports]
 *     parameters:
 *       - in: path
 *         name: iata_code
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[A-Z]{3}$'
 *         description: 3-letter IATA code of the airport
 *     responses:
 *       200:
 *         description: Successful response with airport details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AirportResponse'
 *       400:
 *         description: Invalid IATA code format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Airport not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(API_PATHS.AIRPORT_BY_IATA, (req, res) => airportController.getAirport(req, res));

export default router;