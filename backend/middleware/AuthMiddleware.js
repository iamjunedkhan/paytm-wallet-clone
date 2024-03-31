const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const authMiddleWare   = (req,res,next)=>{
    let auth  =req.headers.authorization;
    // if(auth==undefined){
    //     res.status(403).json({message:'Authorization not found'});
    // }
    console.log('inside authmiddleware');
    console.log('auth is :'+auth);
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(403).json({});
    }
    
    auth  = auth.split(' ')[1];
    let result =null;
    try {
        result =  jwt.verify(auth,JWT_SECRET);
        console.log('result is:');
        console.log(result);
        req.userId= result.userId;
        next();
    } catch (error) {
            console.log(error)
        res.status(403).json({message:'Invalid Authorization Token',err:console.error.message});
        return;
    }
    // console.log({result});
}


module.exports = {
    authMiddleWare
}