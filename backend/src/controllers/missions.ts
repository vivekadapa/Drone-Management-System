import prisma from '../../prisma/client';
import { RequestHandler } from 'express';

export const getAllMissions: RequestHandler = async (req, res) => {
  const missions = await prisma.mission.findMany();
  res.json(missions);
};

export const getMissionById: RequestHandler = async (req, res) => {
  const mission = await prisma.mission.findUnique({ where: { id: req.params.id } });
  if (!mission) {
    res.status(404).json({ error: 'Mission not found' });
    return;
  }
  res.json(mission);
};

export const createMission: RequestHandler = async (req, res) => {
  const { name, area, flightPath, status, startTime, endTime, droneId } = req.body;
  const mission = await prisma.mission.create({
    data: { name, area, flightPath, status, startTime, endTime, droneId },
  });
  res.status(201).json(mission);
};

export const updateMission: RequestHandler = async (req, res) => {
  const { name, area, flightPath, status, startTime, endTime, droneId } = req.body;
  try {
    const mission = await prisma.mission.update({
      where: { id: req.params.id },
      data: { name, area, flightPath, status, startTime, endTime, droneId },
    });
    res.json(mission);
  } catch {
    res.status(404).json({ error: 'Mission not found' });
  }
};

export const deleteMission: RequestHandler = async (req, res) => {
  try {
    
    await prisma.waypoint.deleteMany({
      where: { missionId: req.params.id }
    });
    
    await prisma.mission.delete({ 
      where: { id: req.params.id } 
    });
    
    res.status(204).end();
  } catch(err) {
    res.status(404).json({ error: 'Mission not found' });
  }
};

export const pauseMission: RequestHandler = async (req, res) => {
  try {
    const mission = await prisma.mission.update({
      where: { id: req.params.id },
      data: { status: 'PLANNED' },
    });
    res.json(mission);
  } catch {
    res.status(404).json({ error: 'Mission not found' });
  }
};

export const resumeMission: RequestHandler = async (req, res) => {
  try {
    const mission = await prisma.mission.update({
      where: { id: req.params.id },
      data: { status: 'IN_PROGRESS' },
    });
    res.json(mission);
  } catch {
    res.status(404).json({ error: 'Mission not found' });
  }
};

export const abortMission: RequestHandler = async (req, res) => {
  try {
    const mission = await prisma.mission.update({
      where: { id: req.params.id },
      data: { status: 'ABORTED' },
    });
    res.json(mission);
  } catch {
    res.status(404).json({ error: 'Mission not found' });
  }
}; 