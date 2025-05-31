import express from 'express';
import * as missionController from '../controllers/missions';

const router = express.Router();

router.get('/', missionController.getAllMissions);
router.get('/:id', missionController.getMissionById);
router.post('/', missionController.createMission);
router.put('/:id', missionController.updateMission);
router.delete('/:id', missionController.deleteMission);

router.post('/:id/pause', missionController.pauseMission);
router.post('/:id/resume', missionController.resumeMission);
router.post('/:id/abort', missionController.abortMission);

export default router; 