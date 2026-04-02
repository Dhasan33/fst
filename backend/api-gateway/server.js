const express= require('express');
const proxy = require('express-http-proxy');
const cors = require('cors');
const app = express();
app.use(express.json());
//app.use(cors({
   // origin:"http://localhost:5173",
    //credentials:true
//}));
app.use(cors());

app.use('/product',proxy('http://localhost:3002'));
app.use('/order',proxy('http://localhost:3004'));
app.use('/carts',proxy('http://localhost:3003'));
app.use('/payment',proxy('http://localhost:3001'));
app.use('/users',proxy('http://localhost:3005'));

app.listen(3000,()=>console.log("Gateway running on 3000"));
