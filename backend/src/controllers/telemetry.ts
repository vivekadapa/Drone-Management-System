import prisma from '../../prisma/client';
import { RequestHandler } from 'express';

export const getTelemetryByDrone: RequestHandler = async (req, res) => {
  const telemetry = await prisma.telemetry.findMany({
    where: { droneId: req.params.droneId },
    orderBy: { timestamp: 'desc' },
  });
  res.json(telemetry);
};

export const addTelemetryForDrone: RequestHandler = async (req, res) => {
  const { missionId, latitude, longitude, altitude, battery, status } = req.body;
  const telemetry = await prisma.telemetry.create({
    data: {
      droneId: req.params.droneId,
      missionId,
      latitude,
      longitude,
      altitude,
      battery,
      status,
    },
  });
  res.status(201).json(telemetry);
}; 