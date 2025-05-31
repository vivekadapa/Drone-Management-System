-- CreateEnum
CREATE TYPE "DroneStatus" AS ENUM ('IDLE', 'IN_MISSION', 'CHARGING', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "MissionStatus" AS ENUM ('PLANNED', 'STARTED', 'IN_PROGRESS', 'COMPLETED', 'ABORTED');

-- CreateTable
CREATE TABLE "Drone" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "DroneStatus" NOT NULL,
    "batteryLevel" INTEGER NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "Drone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "area" JSONB NOT NULL,
    "flightPath" JSONB NOT NULL,
    "status" "MissionStatus" NOT NULL,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "droneId" TEXT,

    CONSTRAINT "Mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Waypoint" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "altitude" DOUBLE PRECISION NOT NULL,
    "direction" DOUBLE PRECISION NOT NULL,
    "sensors" TEXT NOT NULL,
    "frequency" INTEGER NOT NULL,

    CONSTRAINT "Waypoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Telemetry" (
    "id" TEXT NOT NULL,
    "droneId" TEXT NOT NULL,
    "missionId" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "altitude" DOUBLE PRECISION NOT NULL,
    "battery" INTEGER NOT NULL,
    "status" "DroneStatus" NOT NULL,

    CONSTRAINT "Telemetry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_droneId_fkey" FOREIGN KEY ("droneId") REFERENCES "Drone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Waypoint" ADD CONSTRAINT "Waypoint_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Telemetry" ADD CONSTRAINT "Telemetry_droneId_fkey" FOREIGN KEY ("droneId") REFERENCES "Drone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Telemetry" ADD CONSTRAINT "Telemetry_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
