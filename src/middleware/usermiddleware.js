import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

const userMiddleware = (req, res,next)=>{
    const token = req.cookie.token;

    if(!token){
        return res.status(401).json({ message: 'No token found, unauthorized' });
    }

    try {

        const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decodedUser;
        next();
        
    } catch (error) {
        console.log("an error occured in the middleware", error.message)
        return res.status(500).json({ message: "Internal server error" });
    }
}
