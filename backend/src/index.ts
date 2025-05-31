import express from 'express';
import cors from 'cors';
import dronesRouter from './routes/drones';
import missionsRouter from './routes/missions';
import waypointsRouter from './routes/waypoints';
import telemetryRouter from './routes/telemetry';
import reportsRouter from './routes/reports';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/drones', dronesRouter);
app.use('/api/missions', missionsRouter);
app.use('/api/waypoints', waypointsRouter);
app.use('/api/telemetry', telemetryRouter);
app.use('/api/reports', reportsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 