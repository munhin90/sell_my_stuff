import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute, PrivateRoute } from "../routes";
import { Dashboard, Loading, Success } from "../pages";
import useLocalStorage from "use-local-storage";
import * as Form from "../components/Forms";
import { Product, Products } from "../components/Products";
import { Order, Orders } from "../components/Orders";
import Layout from "../layout";
import Account from "../components/Account";
import Cart from "../components/Cart";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useLocalStorage("login", "");
  const [admin, setAdmin] = useLocalStorage("admin", "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLoginStatus = axios.get("/api/authenticate");
    const getProducts = axios.get("/api/products");
    const getCart = axios.get("/api/cart");
    Promise.all([getLoginStatus, getProducts, getCart]).then(([status, products, cart]) => {
      const { isLoggedIn, isAdmin } = status.data;
      const cartContent = cart.data.content;
      if (cartContent) setCart(JSON.parse(cartContent));
      setUser(isLoggedIn);
      setAdmin(isAdmin);
      setProducts(products.data);
      setLoading(false);
    });
  }, [setAdmin, setUser]);

  useEffect(() => {
    axios.post("/api/cart", { cart: JSON.stringify(cart) });
  }, [cart]);

  const handleUser = (status) => setUser(status);
  const handleAdmin = (status) => setAdmin(status);
  const handleCartUpdate = (cart) => setCart(cart);

  if (loading) return <Loading />;

  return (
    <div className="App">
      <Router>
        <Layout user={user} cart={cart}>
          <Routes>
            {["/", "/games", "/appliances", "/dvd", "/instruments", "/books"].map((path, index) => (
              <Route key={index} path={path} element={<Products products={products} />} />
            ))}
            <Route path="/product/:id" element={<Product onCartUpdate={handleCartUpdate} cart={cart} />} />
            <Route path="/cart" element={<Cart cart={cart} user={user} onCartUpdate={handleCartUpdate} />} />
            <Route path="/signin" element={<Form.Login onLogin={handleUser} onAdmin={handleAdmin} onCartUpdate={handleCartUpdate} cart={cart} />} />
            <Route path="/signup" element={<Form.Registration onLogin={handleUser} />} />
            <Route path="/success" element={<Success />} />

            <Route element={<ProtectedRoute user={user} />}>
              <Route path="/account" element={<Account onLogout={handleUser} onCartUpdate={handleCartUpdate} />} />
              <Route path="/account/address/edit" element={<Form.EditAddress />} />
              <Route path="/account/user/edit" element={<Form.EditUser />} />
              <Route path="/checkout" element={<Cart cart={cart} user={user} onCartUpdate={handleCartUpdate} />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<Order />} />
            </Route>

            <Route element={<PrivateRoute admin={admin} />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/orders/update/:id" element={<Form.UpdateShipping />} />
              <Route path="/admin/product/update/:id" element={<Form.UpdateProduct />} />
              <Route path="/admin/product/new" element={<Form.NewProduct />} />
            </Route>
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
