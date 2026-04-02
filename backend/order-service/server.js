const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.post('/orders', async (req, res) => {
    try{
  const prod = await axios.get('http://localhost:3003/cart');

  const payment = { status: "success" };

  res.json({
    message: "Order placed",
    payment,
    items: prod.data.cart,
    total: prod.data.total
  });}
  catch(err){
    console.log(err);
    res.status(500).json({ message: "Error placing order" });
  }
});

app.listen(3004, () => console.log("Order service running"));