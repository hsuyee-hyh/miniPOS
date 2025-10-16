import { useParams } from "react-router-dom";
import Navbar from "../Layout/Navbar";
import { useEffect, useState } from "react";
import { Alert, Col, message, Row, Spin } from "antd";

export default function ShowInvoice() {
  const { customerId, invoiceId } = useParams();

  const [errorMsg, setErrorMsg] = useState("");
  const [orders, setOrders] = useState([]);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => {
        setErrorMsg(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  // fetch customer info
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const customerResponse = await fetch(
          `https://localhost:7299/api/customer?id=${customerId}`
        );
        const customerResponseData = await customerResponse.json();

        if (customerResponseData.error) {
          setErrorMsg(customerResponseData.error);
          return;
        }

        if (customerResponseData.success) {
          setCustomer(customerResponseData.customer);
        }
      } catch (err) {
        setErrorMsg("Something went wrong while retreiving Customer Infos.");
        console.error("Error fetching customer data: ", err);
      }
    };
    fetchCustomer();
  }, [customerId]);

  // fetch invoice & order-item
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const invoiceResponse = await fetch(
          `https://localhost:7299/api/invoice/${invoiceId}`
        );
        const invoiceResponseData = await invoiceResponse.json();
        console.log("InvoiceResponseData: ", invoiceResponseData);
        if (invoiceResponseData.error) {
          setErrorMsg(invoiceResponseData.error);
          setLoading(false);
        }
        setInvoice(invoiceResponseData.invoiceList.invoiceDataList);

        // set orderitemIds
        const orderIds = invoiceResponseData.invoiceList.invoiceDataList.map(
          (o) => o.orderItemId
        );
        console.log(orderIds);

        // define parameterized URL
        const params = new URLSearchParams();
        orderIds.forEach((id) => params.append("id", id));

        const orderItemResponse = await fetch(
          `https://localhost:7299/api/orderitem/list?${params}`
        );
        const orderItemResponseData = await orderItemResponse.json();

        if (orderItemResponseData.error) {
          setErrorMsg(orderItemResponseData.error);
          setLoading(false);
        }

        if (orderItemResponseData.success) {
          setOrderItems(orderItemResponseData.orderItemList);
          console.log("OrderItem List: ", orderItemResponseData.orderItemList);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching invoice data: ", err);
      }
    };

    fetchInvoice();
  }, []);

  if (loading)
    return (
      <>
        <div className="flex justify-center items-center mt-80">
          <Spin></Spin>
        </div>
      </>
    );

  return (
    <>
      <Navbar />
      <div className="p-6">
        <div className=" flex-col items-center justify-center">
          {errorMsg && (
            <Alert message={errorMsg} type="error" showIcon className="mb-4" />
          )}
          <h2 className="text-xl font-semibold text-start">Invoice Details </h2>

          <div className="text-sm">({invoiceId})</div>
          <span className="self-end">
            Customer Code: {customer.customerCode}
          </span>
          <span className="self-end">Customer: {customer.name}</span>
          {invoice && (
            <span className="self-end">Created by: {invoice[0].createdBy}</span>
          )}

          <Row justify="center" align="middle" className="mt-4">
            <Col
              xs={4}
              sm={4}
              md={6}
              className="font-bold border border-gray-300 p-3"
            >
              Product
            </Col>
            <Col
              xs={4}
              sm={4}
              md={6}
              className="font-bold border border-gray-300 p-3"
            >
              Total Selling Price
            </Col>
            <Col
              xs={4}
              sm={4}
              md={6}
              className="font-bold border border-gray-300 p-3"
            >
              Quantity
            </Col>
            <Col
              xs={4}
              sm={4}
              md={6}
              className="font-bold border border-gray-300 p-3"
            >
              Balance
            </Col>
          </Row>

          {invoice && invoice.length > 0 ? (
            invoice.map((inv) => {
              const relatedOrderItems = orderItems.filter(
                (item) => item.id === inv.orderItemId
              );
              return relatedOrderItems.map((i) => (
                <>
                  <Row key={inv.id} justify="center" align="start">
                    <Col
                      xs={4}
                      sm={4}
                      md={6}
                      className=" border border-gray-300 p-3"
                    >
                      {i.product}
                    </Col>
                    <Col
                      xs={4}
                      sm={4}
                      md={6}
                      className=" border border-gray-300 p-3"
                    >
                      {i.totalSellingCost}
                    </Col>
                    <Col
                      xs={4}
                      sm={4}
                      md={6}
                      className=" border border-gray-300 p-3"
                    >
                      {i.quantity}
                    </Col>
                    <Col
                      xs={4}
                      sm={4}
                      md={6}
                      className=" border border-gray-300 p-3"
                    >
                      {i.balance}
                    </Col>
                  </Row>
                </>
              ));
            })
          ) : (
            <div className="text-gray-400 text-lg">Invoice data not found</div>
          )}

          {invoice && invoice.length > 0 && (
            <div>
              <Row key={invoice[0].invoiceId} justify="center" align="start">
                <Col xs={4} sm={4} md={6}></Col>
                <Col xs={4} sm={4} md={6}></Col>
                <Col
                  xs={4}
                  sm={4}
                  md={6}
                  className="border border-gray-300 p-3"
                >
                  Total Balance
                </Col>
                <Col
                  xs={4}
                  sm={4}
                  md={6}
                  className="border border-gray-300 p-3"
                >
                  {invoice[0].totalBalance}
                </Col>
              </Row>

              <Row key={invoice[0].invoiceId} justify="center" align="start">
                <Col xs={4} sm={4} md={6}></Col>
                <Col xs={4} sm={4} md={6}></Col>
                <Col
                  xs={4}
                  sm={4}
                  md={6}
                  className="border border-gray-300 p-3"
                >
                  <div className="font-semibold">Paid Amount</div>
                </Col>
                <Col
                  xs={4}
                  sm={4}
                  md={6}
                  className="border border-gray-300 p-3"
                >
                  <div className="font-semibold">{invoice[0].paidAmount}</div>
                </Col>
              </Row>

              <Row key={invoice[0].invoiceId} justify="center" align="start">
                <Col xs={4} sm={4} md={6}></Col>
                <Col xs={4} sm={4} md={6}></Col>
                <Col
                  xs={4}
                  sm={4}
                  md={6}
                  className="border border-gray-300 p-3"
                >
                  <div className="font-semibold">Left Balance</div>
                </Col>
                <Col
                  xs={4}
                  sm={4}
                  md={6}
                  className="border border-gray-300 p-3"
                >
                  <div className="font-semibold text-red-500">
                    {invoice[0].remainingBalance}
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
