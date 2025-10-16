import { useEffect, useState } from "react";
import Navbar from "../Layout/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Input,
  Form,
  Button,
  message,
  Select,
  Spin,
  Row,
  Col,
  Alert,
  Modal,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { v4 } from "uuid";

export default function InvoiceCreation() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [balance, setBalance] = useState([]);
  const [paidAmountRequired, setPaidAmountRequired] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [foundInvoice, setFoundInvoice] = useState(null);

  const [form] = useForm();
  const [formData, setFormData] = useState({
    customerId: customerId,
    orders: [],
    products: [],
    balances: [],
    totalBalance: 0,
    paidAmount: 0,
    remainingBalance: 0,
  });

  // set error msg
  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => {
        setErrorMsg(null);
      }, 5000);
      return () => clearTimeout(timer);
    }

    if (successMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMsg, successMsg]);

  // fetch order data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log("fetching order .....");
        const orderResponse = await fetch(
          `https://localhost:7299/api/order?customerId=${customerId}`
        );
        const orderData = await orderResponse.json();
        console.log("fetch Order data: ", orderData);

        // if (!orderResponse.ok) {
        // message.error(orderData.message);
        // }

        // setOrders(orderData);

        // get productId
        const productIds = orderData.map((order) => order.productId);

        // fetch product data
        const productResponse = await Promise.all(
          productIds.map(async (id) => {
            const res = await fetch(
              `https://localhost:7299/api/product?productId=${id}`
            );
            const productData = await res.json();
            // if (!res.ok) {
            // message.error(productData.message);
            // }
            return productData;
          })
        );

        // set product and formData
        console.log("fetched product data: ", productResponse);
        // setProducts(productResponse);
        setFormData((prev) => ({
          ...prev,
          orders: orderData,
          products: productResponse,
        }));
      } catch (err) {
        console.log(
          "failed to fetch order data from create invoice page: ",
          err
        );
      }
    };

    fetchData();
  }, [customerId]);

  // calculate balance
  useEffect(() => {
    if (!formData.orders.length || !formData.products.length) return;

    // calculate all balance
    const balances = formData.orders.map((order) => {
      const product = formData.products.find((p) => p.id === order.productId);
      return product ? order.totalSellingCost * order.quantity : 0;
    });

    console.log("calculated balances: ", balances);

    // update state
    setFormData((prev) => ({
      ...prev,
      balances: balances,
    }));
  }, [formData.orders, formData.products]);

  // calculate total balance
  useEffect(() => {
    if (!formData.balances.length) return;

    const totalBalance = formData.balances.reduce(
      (sum, currentBalance) => sum + currentBalance,
      0
    );

    // set state
    setFormData((prev) => ({
      ...prev,
      totalBalance: totalBalance,
    }));
    console.log("total balance: ", totalBalance);
  }, [formData.balances]);

  // calculate remaining balance
  useEffect(() => {
    if (formData.paidAmount <= 0) {
      setPaidAmountRequired(true);
    }
    const remainingBalance = formData.totalBalance - formData.paidAmount;
    // update state
    setFormData((prev) => ({
      ...prev,
      remainingBalance: remainingBalance,
    }));
  }, [formData.paidAmount, formData.totalBalance]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name == "paidAmount") {
      if (e.target.value == "") {
        setPaidAmountRequired(true);
      } else {
        setPaidAmountRequired(false);
      }
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const data = {
        orderId: formData.orders.map((o) => o.id),
        productId: formData.products.map((p) => p.id),
        product: formData.products.map((p) => p.productName),
        totalSellingCost: formData.orders.map((o) => o.totalSellingCost),
        quantity: formData.orders.map((o) => o.quantity),
        balance: formData.balances,
        customerId: formData.customerId,
        totalBalance: formData.totalBalance,
        paidAmount: formData.paidAmount,
        remainingBalance: formData.remainingBalance,
      };

      // convert to array of objects
      const orderItems = data.orderId.map((id, index) => ({
        orderId: Number(id),
        productId: Number(data.productId[index]),
        product: data.product[index] || "unknown",
        totalSellingCost: Number(data.totalSellingCost[index]),
        quantity: Number(data.quantity[index]),
        balance: Number(data.balance[index]),
        customerId: Number(data.customerId),
      }));

      console.log("OrderItems: ", orderItems);

      // convert to invoice array of objects
      const invoiceData = {
        totalBalance: Number(data.totalBalance),
        paidAmount: Number(data.paidAmount),
        remainingBalance: Number(data.remainingBalance),
        customerId: Number(data.customerId),
      };
      console.log("Invoice data: ", invoiceData);

      // insert orderitem
      const response = await fetch(
        `https://localhost:7299/api/orderitem/create-orderitem`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderItems),
        }
      );

      //  handle API response
      const result = await response.json();

      if (!response.ok) {
        setErrorMsg(result.error || "Failed to create order item.");
      } else {
        setSuccessMsg("Order item is created successfully.");
      }
    } catch (err) {
      console.error("Error:", err);
      setErrorMsg(err.message);
    }
  };

  const handleInvoiceSubmit = async () => {
    try {
      const orderIds = formData.orders.map((o) => o.id);
      const invoiceId = v4();

      const foundOrderItemsResponse = await fetch(
        `https://localhost:7299/api/orderitem/orderids`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderIds),
        }
      );
      const foundOrderItemsResponseData = await foundOrderItemsResponse.json();
      if (!foundOrderItemsResponseData.success || !foundOrderItemsResponse.ok) {
        setErrorMsg(`Please click on 'Save to Item' firstly.`);
        return;
      }
      const orderItemIds = foundOrderItemsResponseData.orderItems.map(
        (oi) => oi.id
      );

      // create invoice
      // list of invoice which have orderItem
      const invoiceBodyData = orderItemIds.map((id) => ({
        invoiceId: invoiceId,
        totalBalance: Number(formData.totalBalance),
        paidAmount: Number(formData.paidAmount),
        remainingBalance: Number(formData.remainingBalance),
        customerId: Number(customerId),
        orderItemId: Number(id),
      }));
      // console.log("InvoiceBodyData: ", invoiceBodyData)
      const invoiceResponse = await fetch(
        `https://localhost:7299/api/invoice/create-invoice`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(invoiceBodyData),
        }
      );
      const invoiceResponseData = await invoiceResponse.json();
      if (!invoiceResponse.ok) {
        setErrorMsg(invoiceResponseData.message);
      }
      // ask user to re-create invoice
      // console.log("Invoice response data: ", invoiceResponseData);
      if (invoiceResponseData.isNew == false) {
        setIsModalOpen(true);
        setFoundInvoice(invoiceResponseData.foundInvoice);
        // for not memory load
        localStorage.setItem("foundInvoice", JSON.stringify(invoiceResponseData.foundInvoice));
        setSuccessMsg("Invoice is created successfully.");
        return;
      }
    } catch (err) {
      console.log("Error occured while creating invoice: ", err);
      setErrorMsg(err.message);
    }
  };

  const handleShowSubmit = () => {
    const stored = localStorage.getItem("foundInvoice");
    const foundInvoice = stored? JSON.parse(stored) : null;
    navigate(`/customer/${customerId}/invoice/${foundInvoice?.invoiceId}`);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    setIsModalOpen(false);
    // console.log("Found Invoice: ", foundInvoice);

    try {
      const updatedInvoiceResponse = await fetch(
        `https://localhost:7299/api/invoice/update-invoice`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            invoiceId: foundInvoice.invoiceId,
            totalBalance: foundInvoice.totalBalance,
            paidAmount: formData.paidAmount,
            remainingBalance: formData.remainingBalance,
            customerId: foundInvoice.customerId,
          }),
        }
      );

      const updatedInvoiceResponseData = await updatedInvoiceResponse.json();

      console.log(updatedInvoiceResponseData);
      if (updatedInvoiceResponse.success) {
        setSuccessMsg(updatedInvoiceResponseData.success);
      }
      if (updatedInvoiceResponseData.error) {
        setErrorMsg(
          updatedInvoiceResponseData.error || "Failed to update invoice"
        );
        return;
      }
    } catch (error) {
      console.error("Error updating invoice:", error);
      setErrorMsg(error.message);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        {errorMsg && <Alert message={errorMsg} type="error" showIcon />}
        {successMsg && <Alert message={successMsg} type="success" showIcon />}
        <div className="flex flex-col items-center mt-4">
          <Card variant="outlined" className="w-[500px] md:w-[800px]">
            <Form form={form}>
              <div className="flex flex-col my-2 mx-4 space-y-2 flex-1">
                {formData.orders.length === 0 ? (
                  <div className="flex justify-center items-center">
                    <p className="text-xl text-gray-300">
                      No orders found for that customer
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-end mr-20 mt-2">
                      <Button type="primary" onClick={handleInvoiceSubmit}>
                        Create Invoice
                      </Button>
                      <Button
                        style={{
                          backgroundColor: "#ffffff",
                          borderColor: "#3396D3",
                          color: "#3396D3",
                          marginLeft: "8px",
                        }}
                        type="primary"
                        onClick={handleShowSubmit}
                      >
                        Show Invoice
                      </Button>
                    </div>
                    {/* order */}
                    <div className="mt-4">
                      <Row type="flex">
                        <Col span={4} className="font-bold">
                          OrderId
                        </Col>
                        <Col span={4} className="font-bold">
                          Product
                        </Col>
                        <Col span={4} className="font-bold">
                          TotalSellingCost
                        </Col>
                        <Col span={4} className="font-bold">
                          Quantity
                        </Col>
                        <Col span={4} className="font-bold">
                          Balance
                        </Col>
                      </Row>
                    </div>

                    {formData.orders.map((order, index) => (
                      <div>
                        <Row type="flex" key={order.id}>
                          <Col span={4}>
                            <Input
                              name="orderId"
                              value={order.id}
                              readOnly
                              style={{ flex: 1 }}
                            />
                          </Col>

                          <Col span={4}>
                            <Input
                              name="product"
                              value={
                                formData.products?.[index].productName ||
                                "unknown"
                              }
                              readOnly
                              style={{ flex: 1 }}
                            />
                            {/* <Input name="product" value={order.id} style={{ flex: 1 }} /> */}
                          </Col>

                          <Col span={4}>
                            <Input
                              name="totalSellingCost"
                              value={order.totalSellingCost}
                              readOnly
                              style={{ flex: 1 }}
                            />
                          </Col>

                          <Col span={4}>
                            <Input
                              name="Quantity"
                              value={order.quantity}
                              readOnly
                              style={{ flex: 1 }}
                            />
                          </Col>

                          <Col span={4}>
                            <Input
                              name="balance"
                              value={formData.balances?.[index] || 0}
                              readOnly
                              style={{ flex: 1 }}
                            />
                          </Col>
                        </Row>
                      </div>
                    ))}

                    {/* total balance: align with Balance column */}
                    <Row type="flex" className="mt-4">
                      <Col span={4}></Col>
                      <Col span={4}></Col>
                      <Col span={4}></Col>
                      <Col
                        span={4}
                        className="flex items-center justify-center"
                      >
                        <label className="mr-2">Total Balance:</label>
                      </Col>
                      <Col span={4}>
                        <Input
                          name="totalBalance"
                          value={formData.totalBalance}
                          readOnly
                          style={{ flex: 1 }}
                        />
                      </Col>
                    </Row>

                    {/* Paid amount: align with Balance column  */}
                    <Row type="flex" className="mt-2">
                      <Col span={4}></Col>
                      <Col span={4}></Col>
                      <Col span={4}></Col>
                      <Col span={4}>
                        <label className="mr-2">Paid Amount: </label>
                        {paidAmountRequired && (
                          <p className="text-red-500">
                            ** Paid Amount is required. **
                          </p>
                        )}
                      </Col>
                      <Col span={4}>
                        <Input
                          placeholder="Enter Paid Amount"
                          name="paidAmount"
                          value={formData.paidAmount}
                          onChange={handleChange}
                        />
                        {/* </Form.Item> */}
                      </Col>
                    </Row>

                    {/* remaining balance: align with Balance column  */}
                    <Row type="flex">
                      <Col span={4}></Col>
                      <Col span={4}></Col>
                      <Col span={4}></Col>
                      <Col span={4}>
                        {" "}
                        <label className="mr-2">Left Balance: </label>
                      </Col>
                      <Col span={4}>
                        <Input
                          name="remainingBalance"
                          readOnly
                          value={formData.remainingBalance}
                          onChange={handleChange}
                        />
                      </Col>
                    </Row>
                    <div className="flex justify-end mr-32 mt-2">
                      <Button type="primary" onClick={handleSubmit}>
                        Save to Item
                      </Button>
                    </div>
                  </>
                )}

                {/* Submit Button */}
              </div>
            </Form>
          </Card>

          <Modal
            title="Basic Modal"
            closable={{ "aria-label": "Custom Close Button" }}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <p>Do you want to re-create invoice?</p>
          </Modal>
        </div>
      </div>
    </>
  );
}
