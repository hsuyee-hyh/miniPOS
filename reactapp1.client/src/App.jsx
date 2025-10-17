import Login from "./Account/Login";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Register from "./Account/Register";
import { Button, Layout, Menu } from "antd";
import { Header } from "antd/es/layout/layout";
import Home from "./Home";
import ProductCreation from "./Product/ProductCreation";
import ProductList from "./Product/ProductList";
import ProductDetail from "./Product/ProductDetail";
import ProductEdit from "./Product/ProductEdit";
import CustomerList from "./Customer/CustomerList";
import CustomerCreation from "./Customer/CustomerCreation";
import CustomerDetail from "./Customer/CustomerDetail";
import CustomerOrderCreation from "./Customer/CustomerOrderCreation";
import CustomerOrderEdit from "./Customer/CustomerOrderEdit";
import ShowInvoice from "./Invoice/ShowInvoice";
import InvoiceCreation from "./Invoice/InvoiceCreation";
import CustomerEdit from "./Customer/CustomerEdit";

function App() {
  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />}></Route>
          <Route path="/home" element={<Home />} />

          <Route path="/products" element={<ProductList />} />
          <Route path="/product/create" element={<ProductCreation />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/product/edit/:productId" element={<ProductEdit />} />
          {/* <Route path="/product/delete/:productId" element= */}

          <Route path="/customer" element={<CustomerList />} />
          <Route path="/customer/create" element={<CustomerCreation />} />
          <Route path="/customer/:customerId" element={<CustomerDetail />} />
          <Route path="/customer/edit/:customerId" element={<CustomerEdit/>} />
          
          <Route path="/customer/:customerId/create-order" element={<CustomerOrderCreation/>} />
          <Route path="/customer/:customerId/order/:orderId" element={<CustomerOrderEdit/>} />

          <Route path="/customer/:customerId/create-orderitem" element={<InvoiceCreation/>} />
          <Route path="/customer/:customerId/invoice/:invoiceId" element= {<ShowInvoice/>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
