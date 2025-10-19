import { useParams } from "react-router-dom";
import Navbar from "../Layout/Navbar";
import { useEffect, useRef, useState } from "react";
import { Alert, Button, Col, Row, Spin } from "antd";

export default function ShowInvoice() {
  const { customerId, invoiceId } = useParams();
  const invoiceRef = useRef(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [invoice, setInvoice] = useState(null);
  const [invId,setInvId] = useState("");
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
        console.log("fetching custmer info from ShowInvoice....", customerId);
        const customerResponse = await fetch(
          `https://localhost:7299/api/customer/${customerId}`
        );
        const customerResponseData = await customerResponse.json();

        if (customerResponseData.error) {
          setErrorMsg(customerResponseData.error);
          return;
        }

        if (customerResponseData.success) {
          setCustomer(customerResponseData.customer);
          console.log("customer info: ", customerResponseData.customer);
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
        // setInvId(invoiceResponseData.invoiceList.invoiceDataList[0].invoiceId);
        // localStorage.setItem("foundInvoice", 
          // JSON.stringify(invoiceResponseData.invoiceList.invoiceDataList[0].invoiceId)
        // );

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
  }, [invoiceId]);

  const handlePrint = () => {
    if (!invoiceRef.current) return;

    const printWindow = window.open("", "_blank", "width=800,height=600");

    // Get all styles from the current document
    const styles = Array.from(document.styleSheets)
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules)
            .map((rule) => rule.cssText)
            .join("");
        } catch (e) {
          return ""; // Skip cross-origin stylesheets
        }
      })
      .join("");

    // Clone and remove the print button
    const contentClone = invoiceRef.current.cloneNode(true);
    const printButton = contentClone.querySelector("button");
    if (printButton) {
      printButton.remove();
    }

    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice ${invoiceId}</title>
        <style>
          ${styles}
          /* Additional print-specific styles */
          body {
            margin: 20px;
            background: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          .print-header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
          }
          .print-header h1 {
            margin: 0;
            font-size: 24px;
            color: #000;
          }
          /* Hide elements that shouldn't print */
          .no-print {
            display: none !important;
          }
          /* Ensure Ant Design components print correctly */
          .ant-row {
            display: flex !important;
          }
          .ant-col {
            flex: 1;
          }
          /* Print media queries */
          @media print {
            body {
              margin: 0;
              padding: 15px;
            }
            .print-header {
              border-bottom: 2px solid #000;
            }
            .ant-alert {
              display: none !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h1>INVOICE RECEIPT</h1>
          <p><strong>Invoice ID:</strong> ${invoiceId}</p>
          <p><strong>Printed:</strong> ${new Date().toLocaleString()}</p>
        </div>
        ${contentClone.innerHTML}

        <div style="text-align: center; margin-top: 10px;">Thank you for your purchase.</div>
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 500);
            }, 300);
          };
        </script>
      </body>
    </html>
  `);

    printWindow.document.close();
  };

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
      {/* {console.log("invoice ID: ", invId)} */}
      <div className="p-6">
        {errorMsg && (
          <Alert message={errorMsg} type="error" showIcon className="mb-4" />
        )}

        <div className="flex flex-col justify-center items-center">
          <h2 className="text-3xl font-semibold text-start">Invoice</h2>
          <div className="text-sm">({invoiceId})</div>
        </div>

        <div className="flex-col items-center justify-center" ref={invoiceRef}>
          <div className="flex justify-between sm:px-0 sm:mx-0 md:px-38 md:mx-10">
            <div className="flex flex-col ">
              {customer && (
                <div className="flex flex-col mt-4">
                  <div>
                    <span className="mr-4">Customer Code:</span>
                    <span className="font-bold">{customer.customerCode}</span>
                  </div>

                  <div>
                    <span className="mr-4">Customer:</span>
                    <span className="font-bold">{customer.customerName}</span>
                  </div>

                  <div>
                    <span className="mr-4">Created by:</span>
                    <span className="font-bold">{invoice[0].createdBy}</span>
                  </div>

                  <div>
                    <span className="mr-4">Created Date:</span>
                    <span className="font-bold">
                      {new Date(invoice[0].createdDate).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Row justify="center" align="middle" className="mt-4">
            <Col
              xs={4}
              sm={6}
              md={4}
              className="font-bold border border-gray-300 p-3"
            >
              Product
            </Col>
            <Col
              xs={4}
              sm={6}
              md={4}
              className="font-bold border border-gray-300 p-3"
            >
              Total Selling Price
            </Col>
            <Col
              xs={4}
              sm={6}
              md={4}
              className="font-bold border border-gray-300 p-3"
            >
              Quantity
            </Col>
            <Col
              xs={4}
              sm={6}
              md={4}
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
                <Row key={`${inv.id}-${i.id}`} justify="center" align="start">
                  <Col
                    xs={4}
                    sm={6}
                    md={4}
                    className=" border border-gray-300 p-3"
                  >
                    {i.product}
                  </Col>
                  <Col
                    xs={4}
                    sm={6}
                    md={4}
                    className=" border border-gray-300 p-3"
                  >
                    {i.totalSellingCost}
                  </Col>
                  <Col
                    xs={4}
                    sm={6}
                    md={4}
                    className=" border border-gray-300 p-3"
                  >
                    {i.quantity}
                  </Col>
                  <Col
                    xs={4}
                    sm={6}
                    md={4}
                    className=" border border-gray-300 p-3"
                  >
                    {i.balance}
                  </Col>
                </Row>
              ));
            })
          ) : (
            <div className="text-gray-400 text-lg">Invoice data not found</div>
          )}

          {invoice && invoice.length > 0 && (
            <div>
              <Row key={invoice[0].invoiceId} justify="center" align="start">
                <Col xs={4} sm={6} md={4}></Col>
                <Col xs={4} sm={6} md={4}></Col>
                <Col
                  xs={4}
                  sm={6}
                  md={4}
                  className="border border-gray-300 p-3"
                >
                  Total Balance
                </Col>
                <Col
                  xs={4}
                  sm={6}
                  md={4}
                  className="border border-gray-300 p-3"
                >
                  {invoice[0].totalBalance}
                </Col>
              </Row>

              <Row key={invoice[0].invoiceId} justify="center" align="start">
                <Col xs={4} sm={6} md={4}></Col>
                <Col xs={4} sm={6} md={4}></Col>
                <Col
                  xs={4}
                  sm={6}
                  md={4}
                  className="border border-gray-300 p-3"
                >
                  <div className="font-semibold">Paid Amount</div>
                </Col>
                <Col
                  xs={4}
                  sm={6}
                  md={4}
                  className="border border-gray-300 p-3"
                >
                  <div className="font-semibold">{invoice[0].paidAmount}</div>
                </Col>
              </Row>

              <Row key={invoice[0].invoiceId} justify="center" align="start">
                <Col xs={4} sm={6} md={4}></Col>
                <Col xs={4} sm={6} md={4}></Col>
                <Col
                  xs={4}
                  sm={6}
                  md={4}
                  className="border border-gray-300 p-3"
                >
                  <div className="font-semibold">Left Balance</div>
                </Col>
                <Col
                  xs={4}
                  sm={6}
                  md={4}
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

        <div className="flex justify-center sm:px-2 sm:mx-2 md:px-48 md:mx-10 mb-8">
          <Button
            type="primary"
            onClick={handlePrint}
            className="mt-4 bg-blue-600 text-white size-96"
            disabled={!invoice || loading}
          >
            Print Invoice
          </Button>
        </div>
      </div>
    </>
  );
}
