import express from 'express';
import { userRouter } from './routes/user'; // Import user router
import { blogRouter } from './routes/blog'; // Import blog router
const cors = require('cors');

const app = express();

// Use CORS middleware for all routes
app.use(cors());
app.use(express.json());
// Use routers for specific paths
app.use("/api/v1/user", userRouter);
app.use("/api/v1/blog", blogRouter);

app.listen(3000)
export default app;
