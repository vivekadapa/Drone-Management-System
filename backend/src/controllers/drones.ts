import { RequestHandler } from 'express';
import prisma from '../../prisma/client';

export const getAllDrones: RequestHandler = async (req, res) => {
  const drones = await prisma.drone.findMany();
  res.json(drones);
}

export const getDroneById: RequestHandler = async (req, res) => {
  const drone = await prisma.drone.findUnique({ where: { id: req.params.id } });
  if (!drone) {
    res.status(404).json({ error: 'Drone not found' });
    return;
  }
  res.json(drone);
}

export const createDrone: RequestHandler = async (req, res) => {
  const { name, status, batteryLevel, location } = req.body;
  const drone = await prisma.drone.create({
    data: { name, status, batteryLevel, location },
  });
  res.status(201).json(drone);
}

export const updateDrone: RequestHandler = async (req, res) => {
  const { name, status, batteryLevel, location } = req.body;
  try {
    const drone = await prisma.drone.update({
      where: { id: req.params.id },
      data: { name, status, batteryLevel, location },
    });
    res.json(drone);
  } catch {
    res.status(404).json({ error: 'Drone not found' });
  }
}

export const deleteDrone: RequestHandler = async (req, res) => {
  try {
    await prisma.drone.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch {
    res.status(404).json({ error: 'Drone not found' });
  }
} 