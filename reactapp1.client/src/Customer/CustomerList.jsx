import { useEffect, useState } from "react";
import Navbar from "../Layout/Navbar";
import { Button, Spin, Table } from "antd";
import { PageContainer } from "@ant-design/pro-components";
import { useNavigate } from "react-router-dom";

export default function CustomerList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState ([]);
  const [errorMsg, setErrorMsg] = useState("");
  
  useEffect(() => {
  const fetchCustomers = async () => {
    try {
      const response = await fetch("https://localhost:7299/api/customer/customers");
      const data = await response.json();
      if (!response.ok) {
        setErrorMsg(data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      setCustomers(data);
      setLoading(false);
    } catch (err) {
      setErrorMsg(err.message);
      setLoading(false);
    }
  };

  fetchCustomers();
}, []);

  const columns = [
    {
      title: "Customer Code",
      dataIndex: "customerCode",
      key: "customerCode",
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Customer Phone",
      dataIndex: "customerPhone",
      key: "customerPhone",
    },
    {
      title: "Customer Address",
      dataIndex: "customerAddress",
      key: "customerAddress",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-4">
          <Button type="primary" onClick={() => navigate(`/customer/${record.id}`)}>Detail</Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center m-10">
        <Spin></Spin>
      </div>
    );
  }
  return (
    <>
      <Navbar />
      <PageContainer>
        <div className=" px-20">
          <h1 className="text-xl font-bold mb-4">Product List</h1>
          <Table dataSource={customers} columns={columns} rowKey="customerId"/>
        </div>
      </PageContainer>
    </>
  );
}
