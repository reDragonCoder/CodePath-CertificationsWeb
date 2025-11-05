// // Configuración de CORS para permitir orígenes específicos
// const cors = require('cors');

// const ALLOWED_ORIGINS = [
//     'http://localhost:5500',
//     'http://127.0.0.1:5500',
//     'http://localhost:5501',
//     'http://127.0.0.1:5501',
//     'http://localhost:60372/',
//     'http://127.0.0.1:60372/'
// ];

// const corsMiddleware = cors({
//     origin: function (origin, callback) {
//         if (!origin || ALLOWED_ORIGINS.includes(origin)) {
//             return callback(null, true);
//         } 
//         return callback(new Error('Not allowed by CORS: ' + origin));
//     },
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     exposedHeaders: ['Authorization'],
//     optionsSuccessStatus: 200
// });

// module.exports = corsMiddleware;

const cors = require('cors');

const ALLOWED_ORIGINS = [
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:60372',
  'http://127.0.0.1:60372',
  'http://localhost:5501',
  'http://127.0.0.1:5501'
];

//  devolvemos directamente el middleware (una función)
const corsMiddleware = cors({
  origin: function (origin, callback) {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      console.error("Not allowed by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization']
});

module.exports = corsMiddleware; // 
