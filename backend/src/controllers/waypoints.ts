import prisma from '../../prisma/client';
import { RequestHandler } from 'express';

export const getWaypointsByMission: RequestHandler = async (req, res) => {
  const waypoints = await prisma.waypoint.findMany({ where: { missionId: req.params.missionId } });
  res.json(waypoints);
};

export const addWaypointToMission: RequestHandler = async (req, res) => {
  const { latitude, longitude, altitude, direction, sensors, frequency } = req.body;
  const waypoint = await prisma.waypoint.create({
    data: {
      missionId: req.params.missionId,
      latitude,
      longitude,
      altitude,
      direction,
      sensors,
      frequency,
    },
  });
  res.status(201).json(waypoint);
};

export const updateWaypoint: RequestHandler = async (req, res) => {
  const { latitude, longitude, altitude, direction, sensors, frequency } = req.body;
  try {
    const waypoint = await prisma.waypoint.update({
      where: { id: req.params.id },
      data: { latitude, longitude, altitude, direction, sensors, frequency },
    });
    res.json(waypoint);
  } catch {
    res.status(404).json({ error: 'Waypoint not found' });
  }
};

export const deleteWaypoint: RequestHandler = async (req, res) => {
  try {
    await prisma.waypoint.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch {
    res.status(404).json({ error: 'Waypoint not found' });
  }
}; 