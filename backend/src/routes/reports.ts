import express from 'express';
import * as reportsController from '../controllers/reports';

const router = express.Router();

router.get('/organization', reportsController.getOrganizationReport);
router.get('/missions', reportsController.getMissionReports);

export default router; 