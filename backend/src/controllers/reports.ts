import prisma from '../../prisma/client';
import { RequestHandler } from 'express';

export const getOrganizationReport: RequestHandler = async (req, res) => {
  // Total missions
  const totalMissions = await prisma.mission.count();
  // Success = COMPLETED, Failure = ABORTED
  const successCount = await prisma.mission.count({ where: { status: 'COMPLETED' } });
  const failureCount = await prisma.mission.count({ where: { status: 'ABORTED' } });
  // Avg mission duration (in minutes)
  const completedMissions = await prisma.mission.findMany({ where: { status: 'COMPLETED', startTime: { not: null }, endTime: { not: null } } });
  const avgDuration = completedMissions.length > 0 ?
    completedMissions.reduce((sum, m) => sum + ((new Date(m.endTime!).getTime() - new Date(m.startTime!).getTime()) / 60000), 0) / completedMissions.length
    : 0;
  res.json({
    totalMissions,
    successRate: totalMissions ? (successCount / totalMissions) * 100 : 0,
    failureRate: totalMissions ? (failureCount / totalMissions) * 100 : 0,
    avgMissionDuration: avgDuration,
  });
};

export const getMissionReports: RequestHandler = async (req, res) => {
  const missions = await prisma.mission.findMany();
  const reports = missions.map(m => {
    let duration = null;
    if (m.startTime && m.endTime) {
      duration = (new Date(m.endTime).getTime() - new Date(m.startTime).getTime()) / 60000;
    }
    return {
      id: m.id,
      name: m.name,
      status: m.status,
      duration,
      area: m.area,
      flightPath: m.flightPath,
    };
  });
  res.json(reports);
}; 