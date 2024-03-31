const express = require("express");
const { authMiddleWare } = require("../middleware/AuthMiddleware");
const { Account } = require("../db");
const { default: mongoose } = require("mongoose");
const router = express.Router();

router.get("/", authMiddleWare, (req, res) => {
  res.json({ msg: "from account get" });
});

router.get("/balance", authMiddleWare, async (req, res) => {
  let userId = req.userId;
  console.log('inside balance');
  
  let data = await Account.findOne({ userId });

  if (!data) {
    res.status(400).json({ message: "No acount linked" });



    return;
  }

  res.json({ userId, balance: data.balance }); 

  });



    
router.post('/transfer',authMiddleWare,async (req,res)=>{
  console.log('inside transfer'); 
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    
  
    let fromUser = req.userId;
    let toUser = req.body.to;
    let amount = req.body.amount;

    let user = await Account.findOne({userId:fromUser}).session(session);

    if(!user){
      await session.abortTransaction();
      res.status(400).json({message:'invalid account'});
      return;
    }


    if(user.balance<amount){
        await session.abortTransaction();
        res.status(400).json({message:'insufficient balance'});
        return; 
    }

    let toUserAccount = await Account.findOne({userId:toUser}).session(session);
    
    if(!toUserAccount){
      await session.abortTransaction();
      res.status(400).json({message:'invalid account'});
      return;
    }

    await Account.updateOne({userId:fromUser},{$inc:{balance:-amount}}).session(session);
    await Account.updateOne({userId:toUser},{$inc:{balance:amount}}).session(session);

    await session.commitTransaction();

    res.json({message:'trnasfer successfully'});

  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({message:'Internal server error'}); 
  }

})
module.exports = router;

