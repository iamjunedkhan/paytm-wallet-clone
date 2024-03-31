const express = require('express');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./../config')
const zod = require('zod');
const { User, Account } = require('../db');
const { authMiddleWare } = require('../middleware/AuthMiddleware');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ msg: 'user router' })
})

router.post('/signup', async (req, res) => {

    let body = req.body;
    // const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    console.log({body});
    const userValidatoin = zod.object({
        username: zod.string().email().min(6).max(50),
        firstName: zod.string().min(3),
        lastName: zod.string().min(3),
        password: zod.string().min(6).max(50)
    })

    const result = userValidatoin.safeParse(body);
    if (!result.success) {
        res.status(400).json({ message: 'zod valdiation failed', error: result.error.issues.map(is => is) })
        return;
    }
    console.log({ body });
    let data = await User.findOne({ username: body.username });

    if (data) {
        res.status(411).json({ message: "Email already taken / Incorrect inputs" });
        return;
    }

    let user = new User(body);
    try {
        user = await user.save();
        let obj = { userId: user._id,firstName:body.firstName,lastName:body.lastName }

        let acc= new Account({
            userId:user._id,
            balance:Math.floor( Math.random()*10000+1)
            
        })

        await acc.save();

        let token = jwt.sign(obj, JWT_SECRET);

        res.json({
            message: "User created successfully",
            token: token,
        })
        return;
    }
    catch (error) {
        console.log(error.message);
        res.json({
            message: 'Internal server erorr',
            error: error.message
        })
    }

})

router.post('/signin', async (req, res) => {
    let body = req.body;

    console.log({ body });
    try {
        let data = await User.findOne({ username: body.username,  password: body.password });

        if (data == undefined) {
            res.status(411).json({ message: "Invalid Credentials" });
            return;
        }

        let obj = { userId: data._id,firstName:data.firstName,lastName:data.lastName }
        let token = jwt.sign(obj, JWT_SECRET);

        res.json({
            message: "User logged in successfully",
            token: token,
        })
        return;
    }
    catch (error) {
        console.log(error.message);
        res.json({
            message: 'Internal server erorr',
            error: error.message
        })
    }

})

router.get("/check", authMiddleWare, (req, res) => {
    res.json({ message: 'inside check user', userId: req.userId });

})

router.get('/get-detail', authMiddleWare,async (req,res)=>{
    let userId= req.userId;
    
    const user= await User.findOne({_id:userId});
    console.log(user);
    res.json({user});
})

router.post('/update', authMiddleWare, async (req, res) => {
    let body = req.body;
    let userId = req.userId;
    let bodyKeys = Object.keys(body);



    try {
        if (bodyKeys.includes('password')) {
            if(body.password.length<6) 
                throw new Error();  
        }else if(bodyKeys.length == 0){
            throw new Error();
        }
        let result = await User.findOneAndUpdate({ _id: userId }, body);
        res.status(200).json({ message: 'Updated successfully', bodyKeys });
        return;
    } catch (error) {
        res.status(411).json({ message: "Error while updating information" });
        return;
    }
})

router.get('/bulk',authMiddleWare,async (req,res)=>{
    let filter = req.query.filter||'';
    console.log('inside user bulk');
    console.log('Filter '+filter);
    const data=     await User.find({$or:[{firstName:{$regex:filter,$options:'i'}},{lastName:{$regex:filter,$options:'i'}}]});
    console.log(data);
    res.json({users:data.map(d=>{
        return {
            firstName:d.firstName,
            lastName:d.lastName,
            _id:d._id
        }
    })});
}
)
 
module.exports = router