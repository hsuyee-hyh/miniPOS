import { Button, Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

   // Determine active menu key based on current path
  const getActiveKey = () => {
    if (location.pathname.startsWith("/products")) return "product";
    if (location.pathname.startsWith("/product/create")) return "createProduct";
    if (location.pathname.startsWith("/customer/create")) return "createCustomer";
    if (location.pathname.startsWith("/customer")) return "customer";
    return "home";
  };

  return (
    <>
      <Layout>
        <header
          className="flex flex-row justify-between items-center
                  bg-gray-200 px-4"
        >
          <Menu
            mode="horizontal"
            defaultSelectedKeys={[getActiveKey()]}
            className="!bg-gray-200"
          >
            <Menu.Item key="home">
              <Link to="/home">Home</Link>
            </Menu.Item>

            <Menu.SubMenu key="subProduct" title="Product">
              <Menu.Item key="product">
                <Link to="/products">Products</Link>
              </Menu.Item>
              <Menu.Item key="createProduct">
                <Link to="/product/create">Create Product</Link>
              </Menu.Item>
            </Menu.SubMenu>

            <Menu.SubMenu key="subCustomer" title="Customer">
              <Menu.Item key="customer">
                <Link to="/customer">Customers</Link>
              </Menu.Item>
              <Menu.Item key="createCustomer">
                <Link to="/customer/create">Create Customer</Link>
              </Menu.Item>
            </Menu.SubMenu>
          </Menu>


          <div className="space-x-3 mr-2">
            <Button>
              <Link to="/login">Login</Link>
            </Button>
            <Button>
              <Link to="/register">Register</Link>
            </Button>
          </div>
        </header>
      </Layout>
    </>
  );
}
