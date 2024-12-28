import express, { Request, Response } from 'express';
import appRoutes from './routes/appRoutes';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/v1', appRoutes);

app.get('/healthCheck', (req: Request, res: Response) => {
  res.send('Server is up and running!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
