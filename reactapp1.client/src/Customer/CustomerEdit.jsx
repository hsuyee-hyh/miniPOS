import { Alert, Button, Form, Input } from "antd";
import Navbar from "../Layout/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function CustomerEdit() {
  const { customerId } = useParams();
  const navigate  = useNavigate();
  const [errorMsg, setErrorMsg] = useState(null);

  const [formData, setFormData] = useState({
    customerCode: "",
    customerName: "",
    customerPhone: "",
    customerAddress: "",
  });

  // error
  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMsg(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [errorMsg]);

  // fetch customer
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const customerResponse = await fetch(
          `https://localhost:7299/api/customer/edit/${customerId}`
        );
        const customerResponseData = await customerResponse.json();
        if (customerResponseData.error) {
          setErrorMsg(customerResponseData.error);
          return;
        }
        if (customerResponseData.success) {
          // set form data
          setFormData({
            customerCode: customerResponseData.foundCustomer.customerCode,
            customerName: customerResponseData.foundCustomer.customerName,
            customerPhone: customerResponseData.foundCustomer.customerPhone,
            customerAddress: customerResponseData.foundCustomer.customerAddress,
          });
        }
      } catch (err) {
        setErrorMsg("Something went wrong while retrieving customer data.");
        console.error(err);
      }
    };
    fetchCustomer();
  }, [customerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const updateCustomerResponse =await fetch(
        `https://localhost:7299/api/customer/edit/${customerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const updateResponseData =await updateCustomerResponse.json();
      console.log("updated response data: ", updateResponseData);
      if (updateResponseData.error) {
        setErrorMsg(updateResponseData.error);
        return;
      }
      if (updateResponseData.success) {
        navigate(`/customer/${customerId}`);
      }
    } catch (err) {
      setErrorMsg("Something went wrong while updating customer");
      console.error(err);
    }
  };
  return (
    <>
      <Navbar />
      

      {errorMsg && (
        <div className="p-10">
          <Alert message={errorMsg} type="error" showIcon />
        </div>
      )}

      <div className="flex justify-center items-center my-7 ">
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          className="sm:w-[400px]"
        >
          <Form.Item
            label="Customer Code"
            rules={[{ required: true, message: "Please input customer code." }]}
          >
            <Input
              type="text"
              name="customerCode"
              placeholder="Customer Code"
              value={formData.customerCode}
              onChange={handleChange}
            />
          </Form.Item>

          <Form.Item
            label="Customer Name"
            rules={[{ required: true, message: "Please input customer name." }]}
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

          <Button type="primary" htmlType="submit" onClick={handleSubmit}>
            Save Change
          </Button>
        </Form>
      </div>
    </>
  );
}
