import UserModel from "../features/user/user.model.js";

// Issues with Basic Auth
// 1. No encryption (using encoded)
// 2. Need to store password on client side
// 3. Passwords are difficult to handle

const basicAuth = (req, res, next) => {

    // 1. check for authorization header in request
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(400).send("Auth is missing!");
    }

    // console.log(authHeader);

    // 2. getting the data from authHeader
    const base64Creds = authHeader.replace('Basic ', '');

    // console.log(base64Creds);

    const decodedCreds = Buffer.from(base64Creds, 'base64').toString("utf-8");
    // console.log(decodedCreds); // seller@gmail.com:123456
    const [email, password] = decodedCreds.split(":");
    // console.log(email, password)

    // 3. checking if user exists
    const users = UserModel.getAllUsers();
    const user = users.find((user) => user.email == email && user.password == password);

    if (user) {
        next();
    } else {
        return res.status(401).send("Unauthorized");
    }

}

export default basicAuth;