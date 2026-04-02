const express = require('express');
const app = express();

app.use(express.json());

let cart = [];

app.post('/cart', (req, res) => {
  cart.push(req.body);
  res.send("Added to cart");
});

app.get('/cart', (req, res) => {
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  res.json({cart, total });
});
app.put('/:index', (req, res) => {
  const index = req.params.index;

  if (!cart[index]) {
    return res.status(404).send("Item not found");
  }

  cart[index] = {
    ...cart[index],
    ...req.body
  };

  res.send("Cart updated");
});
app.delete('/:id',(req,res)=>{
    cart=cart.filter(item=>item._id!==req.params.id);
    res.send("Removed from cart");
});

app.listen(3003, () => console.log("Cart service running"));