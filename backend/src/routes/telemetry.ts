import express from 'express';
import * as telemetryController from '../controllers/telemetry';

const router = express.Router();

router.get('/drone/:droneId', telemetryController.getTelemetryByDrone);
router.post('/drone/:droneId', telemetryController.addTelemetryForDrone);

export default router; 