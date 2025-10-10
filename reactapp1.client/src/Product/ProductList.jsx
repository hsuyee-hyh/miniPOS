import { useEffect, useState } from "react";
import Navbar from "../Layout/Navbar";
import { Alert, Button, message, Spin, Table } from "antd";
import { PageContainer } from "@ant-design/pro-components";
import { useNavigate } from "react-router-dom";

export default function ProductList() {
    const navigate = useNavigate();
  const [Products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://localhost:7299/api/product/products")
      .then((response) => {
        if (!response.ok) {
          message.error("Failed to fetch products");
          setLoading(false);
          return;
        }
        return response.json();
      })
      .then((data) => {
        console.log("products from api: ", data);
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        message.error("Error fetching the products: ", error.message);
        setLoading(false);
      });
  }, []);

  const columns = [
    {
      title: "Image",
      dataIndex: "imgUrl",
      key: "imgUrl",
      render: (imgUrl, record) => (
        <img
          src={`https://localhost:7299${imgUrl}`}
          alt={record.productName}
          className="w-[60px] h-[60px] object-cover rounded-2xl"
        />
      ),
    },

    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    { title: "Buying Price", dataIndex: "buyingPrice", key: "buyingPrice" },
    {
      title: "Product Name",
      dataIndex: "sellingPrice",
      key: "sellingPrice",
    },
    {
      title: "InStock",
      dataIndex: "stockLvl1",
      key: "stockLvl1",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-4">
          <Button type="primary" onClick={() => navigate(`/product/${record.id}`)}>Detail</Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center m-10">
        <Spin tip="Loading...">
        </Spin>
      </div>
    );
  }
  return (
    <>
      <Navbar></Navbar>
      <PageContainer>
        <div className=" px-20">
          <h1 className="text-xl font-bold mb-4">Product List</h1>
          <Table dataSource={Products} columns={columns} rowKey="productId" />
        </div>
      </PageContainer>
    </>
  );
}
