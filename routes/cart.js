const Cart = require("../models/cart");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();


//create

router.post("/", verifyToken, async (req, res) => {
    try {
      const newcart = new Cart(req.body);
      const savedcart = await newcart.save();
      res.status(200).json(savedcart);
    } catch (error) {
      res.status(500).json(`Error: ${error} cannot find cart`);
    }
  });

  //update cart

  router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
      const updatedcart = await Cart.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedcart);
    } catch (error) {
      res.status(500).json(`Error: ${error}`);
    }
  });

  //delete cart

  router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
      await Cart.findByIdAndDelete(req.params.id)
      res.status(200).json("cart deleted");
    } catch (error) {
      res.status(500).json(`Error: ${error}`);
    }
  });


  //GET USER CART

  router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        res.status(200).json(cart);
      } catch (err) {
        res.status(500).json(err);
      }
    });

  //GET ALL CARTS
    
  router.get("/", verifyTokenAndAdmin, async (req, res) => {
        try {
          const carts = await Cart.find();
          res.status(200).json(carts);
        } catch (error) {
            res.status(500).json({ message: "no carts found" });
        }
    });

    
module.exports = router;
