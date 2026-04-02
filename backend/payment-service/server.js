const express = require('express');
const app = express();

app.post('/pay', (req, res) => {
  res.json({ status: "Payment Successful" });
});

app.listen(3001, () => console.log("Payment service running"));