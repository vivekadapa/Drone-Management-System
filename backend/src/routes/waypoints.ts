import express from 'express';
import * as waypointController from '../controllers/waypoints';

const router = express.Router();

router.get('/mission/:missionId', waypointController.getWaypointsByMission);
router.post('/mission/:missionId', waypointController.addWaypointToMission);
router.put('/:id', waypointController.updateWaypoint);
router.delete('/:id', waypointController.deleteWaypoint);

export default router; 