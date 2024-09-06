const Order = require("../models/order");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();


//create 

router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);

    try {
      const savedOrder = await newOrder.save();
      res.status(200).json(savedOrder);
    } catch (err) {
      res.status(500).json(err);
    }
  });


  //update

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});
  //delete 

  router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    

     try {
        await new Order.findByIdAndDelete(req.params.id)
        res.status(200).json("order deleted.")
     } catch (error) {
        res.status(500).json(err)
     }

  })


  //GET USER ORDERS
 router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const userOrder = await User.findOne({ userid: req.params.userId });
     res.status(200).json(userOrder)
  } catch (error) {
    res.status(500).json(err)
  }

  })

  //get all
  router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
      const allOrders = await new Order.find()
      res.status(200).json(allOrders);
  } catch (error) {
    res.status(500).json(err);
  }
  });

  router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  
    try {
      const income = await Order.aggregate([
        { $match: { createdAt: { $gte: previousMonth } } },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$amount",
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" },
          },
        },
      ]);
      res.status(200).json(income);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  module.exports = router;
