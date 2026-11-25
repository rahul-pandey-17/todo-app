import app from './app.js';
import connectDB from './config/db.js';
import env from './config/env.js';

const start = async () => {
  try {
    await connectDB();

    app.listen(env.PORT, () => {
      console.log(`Server is listening at http://localhost:${env.PORT}`);
    });
  } catch (err) {
    console.error('Failed to start app:', err);
    process.exit(1);
  }
};

start();
