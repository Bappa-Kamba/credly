import express from 'express';
import cors from 'cors';
import verificationRoutes from './routes/verificationRoutes.js';
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/verify', verificationRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});

export default app;
