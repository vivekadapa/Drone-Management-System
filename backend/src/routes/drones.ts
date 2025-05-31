import express from 'express';
import * as droneController from '../controllers/drones';

const router = express.Router();

router.get('/', droneController.getAllDrones);
router.get('/:id', droneController.getDroneById);
router.post('/', droneController.createDrone);
router.put('/:id', droneController.updateDrone);
router.delete('/:id', droneController.deleteDrone);

export default router; 