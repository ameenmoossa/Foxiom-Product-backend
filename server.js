const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const morgan = require('morgan');

dotenv.config();
connectDB();

const app = express();
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, filePath) => {
    try {
      const buffer = Buffer.alloc(12);
      const fd = fs.openSync(filePath, 'r');
      fs.readSync(fd, buffer, 0, 12, 0);
      fs.closeSync(fd);

      if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
        res.setHeader('Content-Type', 'image/webp');
      }
    } catch {
      // Fall back to Express' default static headers.
    }
  },
}));

// NoSQL injection sanitizer
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (key.startsWith('$') || key.includes('.')) {
          delete obj[key];
        } else {
          sanitize(obj[key]);
        }
      }
    }
  };
  sanitize(req.body);
  next();
});

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/products/:id/access-links', require('./routes/accessLink.routes'));
app.use('/api/products/:id/credentials', require('./routes/credential.routes'));
app.use('/api/products/:id/feedback', require('./routes/feedback.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
