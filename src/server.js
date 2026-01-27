const mongoose = require('mongoose');
const config = require('./config/env');
const app = require('./app');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(config.PORT, '0.0.0.0', () => {
      console.log(`Server running in ${config.NODE_ENV} mode on port ${config.PORT}`);
      console.log(`API available at http://localhost:${config.PORT}/api/${config.API_VERSION}`);
      console.log(`\n📱 For external access (Flutter/Mobile developers):`);
      console.log(`   Replace 'localhost' with your IP address`);
      console.log(`   Example: http://<YOUR_IP>:${config.PORT}/api/${config.API_VERSION}`);
      console.log(`   Run 'ipconfig' to find your IP address\n`);
    });

    // Handle server errors (e.g., port already in use)
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Port ${config.PORT} is already in use!`);
        console.error(`   Please either:`);
        console.error(`   1. Stop the process using port ${config.PORT}`);
        console.error(`   2. Set a different PORT in your .env file`);
        console.error(`\n   To find the process: netstat -ano | findstr :${config.PORT}`);
        console.error(`   To kill it: taskkill /PID <PID> /F\n`);
      } else {
        console.error(`Server error: ${err.message}`);
      }
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('UNHANDLED REJECTION! Shutting down...');
      console.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('Process terminated');
        mongoose.connection.close(false, () => {
          process.exit(0);
        });
      });
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();


