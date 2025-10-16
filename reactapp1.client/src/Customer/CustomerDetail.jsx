import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Layout/Navbar";
import { useEffect, useState } from "react";
import { PageContainer } from "@ant-design/pro-components";
import { Alert, Button, Card, message, Modal, Table } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";

export default function CustomerDetail() {
  const { customerId } = useParams();
  const navigate = useNavigate();

  const [foundCustomer, setFoundCustomer] = useState(null);
  const [orders, setOrders] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMsg("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [errorMsg]);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
       
        const response = await fetch(
          `https://localhost:7299/api/customer/${customerId}`
        );
        const data = await response.json();

        if (data.error) {
          setErrorMsg(data.error);
          return;
        }
        if (data.success) {
        
          setFoundCustomer(data.customer);
        }
      } catch (error) {
        setErrorMsg(err.message || "Failed to fetch customer detail");
      }
    };

    if (customerId) {
      fetchCustomer();
    }
  }, [customerId]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(
          `https://localhost:7299/api/order?customerId=${customerId}`
        );
        const data = await response.json();
        if (!response.ok) {
          setErrorMsg(data.message);
        }
        setOrders(data);
      } catch (err) {
        // setErrorMsg(err.message || "Failed to fetch the orders.");
      }
    };
    fetchOrder();
  }, [customerId]);

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "Selling Price",
      dataIndex: "sellingPrice",
      key: "sellingPrice",
    },
    {
      title: "Additional Selling Price",
      dataIndex: "additionalSellingPrice",
      key: "additionalSellingPrice",
    },
    {
      title: "Total Selling Cost",
      dataIndex: "totalSellingCost",
      key: "totalSellingCost",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => {
        return (
          <>
            <div className="flex space-x-4">
              <Button
                type="primary"
                onClick={() =>
                  navigate(`/customer/${customerId}/order/${record.id}`)
                }
              >
                Edit
              </Button>
              <Button
                onClick={() => showOrderModal(record.id)}
                style={{ backgroundColor: "#ffffff", borderColor: "#3396D3" }}
              >
                Delete
              </Button>
            </div>
          </>
        );
      },
    },
  ];

  const showOrderModal = (orderId) => {
    setSelectedOrderId(orderId);
    setIsOrderModalOpen(true);
  };
  const handleOrderOk = async () => {
    try {
      console.log("delete orderId is ", selectedOrderId);
      const response = await fetch(
        `https://localhost:7299/api/order/delete/customer/${customerId}/order/${selectedOrderId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message);
        message.error(data.message);
      }
      window.location.reload();
      setIsOrderModalOpen(false);
    } catch (err) {
      setErrorMsg("Failed to delete that order: ", err.message);
    }
  };

  const handleOrderCancel = () => {
    setSelectedOrderId(null);
    setIsOrderModalOpen(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const response = await fetch(
        `https://localhost:7299/api/customer/delete/${customerId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setErrorMsg(data.message);
        return;
      }
      navigate("/customer");
    } catch (err) {
      setErrorMsg("Error of fetching this customer: ", err.message);
    }
  };

  const handleCancel = () => {
    navigate(`/customer/${foundCustomer.id}`);
  };

  return (
    <>
      <Navbar />
      <PageContainer>
        <div className="flex flex-col items-center">
         
          {errorMsg && (
            <Alert type="error" message={errorMsg} className="mb-4" />
          )}

          <div className="flex justify-end w-full max-w-[800px] mb-4">
            <Button
              type="primary"
              onClick={() => navigate(`/customer/edit/${foundCustomer.id}`)}
              className="mr-2"
            >
              Edit
            </Button>
            <Button
              onClick={showModal}
              style={{ backgroundColor: "#ffffff", borderColor: "#3396D3" }}
            >
              Delete
            </Button>

            <Modal
              title="Are you sure to delete?"
              closable={{ "aria-label": "Custom Close Button" }}
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            ></Modal>
          </div>

          {foundCustomer && (
            <Card variant="outlined" style={{ width: 400 }}>
              <div className="flex flex-col justify-center space-y-2">
                <div className="flex flex-row self-start">
                  <span className="text-md font-semibold mr-2">Code: </span>
                  <span>{foundCustomer.customerCode}</span>
                </div>

                <div className="flex flex-row ">
                  <span className="text-md font-semibold mr-2">Name: </span>
                  <span>{foundCustomer.customerName}</span>
                </div>

                <div className="flex flex-row">
                  <span className="text-md font-semibold mr-2">Phone: </span>
                  <span>{foundCustomer.customerPhone}</span>
                </div>

                <div className="flex flex-row">
                  <span className="text-md font-semibold mr-2">Address: </span>
                  <span>{foundCustomer.customerAddress}</span>
                </div>
              </div>
            </Card>
          )}

          <div className="flex justify-end w-full max-w-[800px] mb-4">
            <Button
              type="primary"
              onClick={() =>
                navigate(`/customer/${foundCustomer.id}/create-order`)
              }
              className="mr-2"
            >
              Create Order
            </Button>

            <Button
              style={{ backgroundColor: "#ffffff", borderColor: "#3396D3" }}
              onClick={() =>
                navigate(`/customer/${foundCustomer.id}/create-orderitem`)
              }
            >
              Go to Item
            </Button>
          </div>

          <Card variant="outlined" className="md:w-[800px] h-[300px]">
            {!orders && (
              <div className="flex flex-col justify-center items-center my-24">
                <FontAwesomeIcon icon={faBoxOpen} size="2xl" color="gray" />
                <div className="text-gray-500 flex justify-center items-center">
                  There is no orders yet.
                </div>
              </div>
            )}

            {orders && (
              <div className="flex flex-col justify-center space-y-2">
                <Table dataSource={orders} columns={columns} key="orderId" />
              </div>
            )}
          </Card>

          <Modal
            title="Are you sure to delete that order?"
            closable={{ "aria-label": "Custom Close Button" }}
            open={isOrderModalOpen}
            onOk={handleOrderOk}
            onCancel={handleOrderCancel}
          ></Modal>
        </div>
      </PageContainer>
    </>
  );
}
