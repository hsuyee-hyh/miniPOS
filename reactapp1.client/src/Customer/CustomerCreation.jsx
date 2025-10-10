import { Alert, Button, Form, Input, message } from "antd";
import Navbar from "../Layout/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerCreation() {
  const [formData, setFormData] = useState({
    customerCode: "",
    customerName: "",
    customerPhone: "",
    customerAddress: "",
  });
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => {
        setErrorMsg("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    console.log("form data is ", formData);
    try {
      const form = new FormData();
      form.append("CustomerCode", formData.customerCode);
      form.append("CustomerName", formData.customerName);
      form.append("CustomerPhone", formData.customerPhone);
      form.append("CustomerAddress", formData.customerAddress);

      const response = await fetch(
        "https://localhost:7299/api/customer/create-customer",
        {
          method: "POST",
          body: form,
        }
      );

      const data = await response.json();
      if (!response.ok) {
        setErrorMsg(data.message || "Something went wrong.");
        // message.error(data.message);
        return;
      }

      // message.success(data.message);
      navigate("/customer");
    } catch (err) {
      setErrorMsg(err.message);
      // message.error(err.message);
    }
  };
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center my-7">
        {errorMsg && <Alert message={errorMsg} type="error" className="mb-5" />}
        <div className="md:w-[400px]">
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Customer Code"
              rules={[
                { required: true, message: "Please input customer code." },
              ]}
            >
              <Input
                type="text"
                name="customerCode"
                placeholder="Customer Code"
                value={formData.customerCode}
                onChange={handleChange}
                className="flex-10"
              />
            </Form.Item>

            <Form.Item
              label="Customer Name"
              rules={[
                { required: true, message: "Please input customer name." },
              ]}
            >
              <Input
                type="text"
                name="customerName"
                placeholder="Customer Name"
                value={formData.customerName}
                onChange={handleChange}
              />
            </Form.Item>

            <Form.Item
              label="Customer Phone"
              rules={[
                { required: true, message: "Please input customer phone." },
              ]}
            >
              <Input
                type="text"
                placeholder="Customer Phone"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
              />
            </Form.Item>

            <Form.Item
              label="Customer Address"
              rules={[
                { required: true, message: "Please input customer address." },
              ]}
            >
              <Input
                type="text"
                placeholder="Customer Address"
                name="customerAddress"
                value={formData.customerAddress}
                onChange={handleChange}
              />
            </Form.Item>

            <Button type="primary" htmlType="submit">
              Create Customer
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
}
