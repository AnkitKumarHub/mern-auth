// we are getting userId from the token and the token is stored in the cookies
//so we need a middleware to get the token from the cookies and from that cookiet we will find the userId and then userID will be added in the request body with the help of function and then verify it


import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const{ token } = req.cookies;

    if(!token) return res.status(401).json({success: false, message: "Unauthorized! Login again to continue"});

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        if(tokenDecode.id){
            req.body.userId = tokenDecode.id;
            
        }else{
            return res.status(401).json({success: false, message: "Unauthorized! Login again to continue"});
        }  

        next();
        
    } catch (error) {
        res.json({success: false, message: error.message});
    }

}

export default userAuth;