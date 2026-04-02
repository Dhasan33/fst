import { useState } from 'react';
import axios from 'axios';


function App() {

  const BASE_URL = 'http://localhost:3000';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);
  // ================= USER =================
   const handleEdit = (product) => {
  setName(product.name);
  setPrice(product.price);
  setStock(product.stock);
  setEditId(product._id);
};
  const register = async () => {
    const response = await axios.post(`${BASE_URL}/users/register`, { email, password });
    alert("Registered");
  };

  const login = async () => {
    const res = await axios.post(`${BASE_URL}/users/login`, { email, password });
    localStorage.setItem("token", res.data.token);
    alert("Logged in");
  };

  // ================= PRODUCT =================

  const addProduct = async () => {
    const formdata=new FormData();
    formdata.append('name',name);
    formdata.append('price',price);
    formdata.append('stock',stock);
    formdata.append('image',image);
    await axios.post(`${BASE_URL}/product/products`, formdata);
    alert("Product Added");
  };
  const updateProduct = async (id) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("price", price);
  formData.append("stock", stock);
  if (image) formData.append("image", image);

  await axios.put(`${BASE_URL}/product/${id}`, formData);

  alert("Product Updated");

  setEditId(null); // 🔥 reset mode
  setName('');
  setPrice('');
  setStock('');
  setImage(null);
  getProducts();
};

  const getProducts = async () => {
    const res = await axios.get(`${BASE_URL}/product/products`);
    setProducts(res.data);
  };
  const deleteProduct=async(id)=>{
    const confirm=window.confirm("Are you sure?");
    if (confirm) {
      await axios.delete(`${BASE_URL}/product/${id}`);
      alert("Product Deleted");
      getProducts();
    }
  }
  // ================= CART =================

  const addToCart = async (product) => {
    await axios.post(`${BASE_URL}/carts/cart`, product);
    alert("Added to cart");
  };

  const getCart = async () => {
    const res = await axios.get(`${BASE_URL}/carts/cart`);
    setCart(res.data.cart);
    setTotal(res.data.total);
  };
  const updateCartItem = async (index) => {
  await axios.put(`${BASE_URL}/carts/${index}`, {
    price: 999 // example update
  });

  getCart();
};
  const removeFromCart=async(id)=>{
    
    const confirm=window.confirm("Are you sure?");
    if (confirm) {
      await axios.delete(`${BASE_URL}/carts/${id}`);
      alert("Product Removed from Cart");
      getCart();
    }
  }

  // ================= ORDER =================

  const placeOrder = async () => {
    const res = await axios.post(`${BASE_URL}/order/orders`);
    alert(res.data.message);
    console.log(res.data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🔥 E-Commerce Microservices</h1>

      {/* USER */}
      <h2>User</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <br />
      <button onClick={register}>Register</button>
      <button onClick={login}>Login</button>

      <hr />

      {/* PRODUCT */}
      <h2>Add Product</h2>
      <input placeholder="Name" onChange={e => setName(e.target.value)} />
      <input placeholder="Price" onChange={e => setPrice(e.target.value)} />
      <input placeholder="Stock" onChange={e => setStock(e.target.value)} />
      <input type="file" onChange={e => setImage(e.target.files[0])} />
      <br />
      <button onClick={editId ? () => updateProduct(editId) : addProduct}>
  {editId ? "Update Product" : "Add Product"}
</button>

      <hr />

      <h2>Products</h2>
      <button onClick={getProducts}>Load Products</button>
      

      {products.map((p, i) => (
        <div key={i}>
          {p.name} - ₹{p.price}
          <img src={`http://localhost:3002/uploads/${p.image}`} alt={p.name} width="100" height="50" />
          <button onClick={() => addToCart(p)}>Add to Cart</button>
          <button onClick={() => deleteProduct(p._id)}>Remove</button>
          <button onClick={() => handleEdit(p)}> Edit</button>
          <button onClick={() => { setEditId(null); setName(''); setPrice(''); setStock('');setImage(null);}}>
  Cancel
</button>

        </div>
      ))}

      <hr />

      {/* CART */}
      <h2>Cart</h2>
      <button onClick={getCart}>View Cart</button>

      {cart.map((c, i) => (
        <div key={i}>
          {c.name} - ₹{c.price}

          
          <button onClick={() => removeFromCart(c._id)}> Remove</button>
          <button onClick={() => updateCartItem(i)}> Update</button>
        </div>
      ))}
      TOTAL : ₹{total}

      <hr />

      {/* ORDER */}
      <h2>Order</h2>
      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
}

export default App;