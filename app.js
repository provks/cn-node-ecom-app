import express from 'express';
import 'dotenv/config';
// console.log("process.env S3_BUCKET", process.env.S3_BUCKET)
// console.log("process.env SECRET_KEY", process.env.SECRET_KEY)
import productRoutes from './src/features/product/product.routes.js'
import userRoutes from './src/features/user/user.routes.js'
import cartRoutes from './src/features/cart/cartItem.routes.js'
// import basicAuth from './src/middlewares/basicAuth.middleware.js';
import jwtAuth from './src/middlewares/jwt.middleware.js';
import swaggerUi from 'swagger-ui-express';
// import swaggerDocument from './swagger.json' assert { type: 'json' };
import swaggerDocument from './swagger3.json' assert { type: 'json' };
import cors from "cors";
import logger from './src/middlewares/logger.middleware.js';
import ApplicationError from './src/error_handler/app.error.js';
// import { connectToDB } from './src/config/mongodb.config.js'
import orderRoutes from './src/features/order/order.routes.js'
import likeRoutes from './src/features/like/like.routes.js'
import { connectToDBWithMongoose } from './src/config/mongoose.config.js';
import mongoose from 'mongoose';

const app = express();
const port = 3000;

// connect to db using mongodb driver
// connectToDB();

// connect to db using mongoose
connectToDBWithMongoose();


// CORS library/package
// const corsOptions = {
//   origin: 'http://127.0.0.1:5500',
//   // optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }


app.use(cors());

app.use(express.json());
// parse the form data
app.use(express.urlencoded({extended: true}));

// app.use(basicAuth);

// Handle CORS
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', "http://127.0.0.1:5500"); // defined consumer
//   res.header('Access-Control-Allow-Headers', "*");  // header values
//   res.header('Access-Control-Allow-Methods', "*");  // all the methods

//   if (req.method == "OPTIONS") {
//     return res.sendStatus(200); // pre-flight request
//   }
//   next();
// });



// swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(logger);

// domainName.com/api/product/21  (GET)
// app.use('/api/product', basicAuth, productRoutes);
app.use('/api/user', userRoutes);

// like routes
app.use('/api/like', jwtAuth, likeRoutes);

// order routes
app.use('/api/order', jwtAuth, orderRoutes);


app.use('/api/product', jwtAuth, productRoutes);

app.use('/api/cart', jwtAuth, cartRoutes);


app.get('/', (req, res) => {
  res.send("Hello from Nodejs");
})

// 404 error handling using middleware
app.use((req, res) => {
  return res.status(404).send("API doesn't exist, check our API docs here: localhost:3000/api-docs");
});

// App/System Error handling middleware
app.use((err, req, res, next) => {
  // console.error(err.stack)
  if (err instanceof ApplicationError) {
    const { code, message } = err;
    return res.status(code).send(message);
  }
  
  if (err instanceof mongoose.Error.ValidationError) {
    const { message } = err;
    return res.status(400).send(message);
  }
  console.log(err)

  // log this err in file
  // logger.log();

  return res.status(500).send('Oops, Something went wrong!');
});


// app.use('/api/cart', cartRoutes)

// app.use('/api/order', orderRoutes);

app.listen(port, () => {
  console.log(`Our app listening on port ${port}`);
})