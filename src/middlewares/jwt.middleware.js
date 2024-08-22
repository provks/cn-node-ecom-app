import jwt from 'jsonwebtoken';

const jwtAuth = (req, res, next) => {
    // Get the token from request
    // console.log("req.headers", req.headers);
    const token = req.headers.authorization;
    // console.log("token", token);

    if (!token) {
        return res.status(400).send("Unauthorised!");
    }

    // Verify the token
    try {
        const validToken = jwt.verify(token, 'X6LZeB7bU17EzJDeGRQjYEV0ontPi8Zb');
        // console.log("validToken", validToken);
        req.userId = validToken.id;
    } catch(err) {
        // err
        console.log("error:", err);
        return res.status(401).send("Invalid token");
    }
    next();
}

export default jwtAuth;