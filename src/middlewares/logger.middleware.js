import fs from 'fs';
import winston from 'winston';

const fsPromise =  fs.promises;

// const addLog = async (data, url) => {
//     const timeStamp = new Date().toString();
//     data = `\n Time: ${timeStamp}, URL:${url}, reqBody:${JSON.stringify(data)}`
//     try {
//         await fsPromise.appendFile('logs.txt', data);
//     } catch (error) {
//         console.log(error);
//     }
// }

const winstonLogger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'e-commerce', name: "varun" },
    transports: [
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //
      new winston.transports.File({ filename: 'logs.txt' }),
    //   new winston.transports.File({ filename: 'combined.log' }),
    ],
  });
  

const logger = async (req, res, next) => {

    // method to write req to file -> logs.txt
    //  check for login/signup path
    if (!req.url.includes('user')) {
        // await addLog(req.body, req.originalUrl);
        const timeStamp = new Date().toString();
        const data = `\n Time: ${timeStamp}, URL:${req.url}, reqBody:${JSON.stringify(req.body)}`
        // winstonLogger.info(data);
        winstonLogger.error(data);
    }
    next();

}

export default logger;