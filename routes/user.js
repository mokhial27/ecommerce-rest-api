// Import the User model
const User = require("../models/User");

// Import verification middleware functions
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");


// Create an instance of the Express Router
const router = require("express").Router();



// Define a route for updating a user (PUT method)
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password, 
        process.env.PASS_SEC
      ).toString(); 
    }
   
    
  });
  // Try to update the user
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
  // Return the updated user as a JSON response
    res.status(200).json(updatedUser);
    // Return an error response if the update fails
  } catch (error) {
    res.status(500).json(err)
  }
  

  // Define a route for deleting a user (DELETE method)

  router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted");
    } catch (error) {
      res.status(500).json(error);
    }
  });

  ////GET USER

  router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const { password, ...others } = user._doc;
      res.json(others); // send the response
    } catch (error) {
      res.status(500).json({ message: "Error finding user" }); // handle error
    }
  });

  //get all users 

  router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
      const users = query ? User.find().sort({id: -1}).limit(5) : await User.find();
      res.status(200).json(users)
    } catch (error) {
      res.status(500).json(err);
    }
  });


  router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  
    try {
      const data = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  module.exports = router;
