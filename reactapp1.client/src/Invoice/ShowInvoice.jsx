import { useParams } from "react-router-dom";
import Navbar from "../Layout/Navbar";
import { useEffect, useState } from "react";
import { Col, message, Row, Spin } from "antd";

export default function ShowInvoice() {
  const { customerId, invoiceId } = useParams();

  const [errorMsg, setErrorMsg] = useState("");
  const [orders, setOrders] = useState([]);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderItems, setOrderItems] = useState([]);

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
      {console.log("customer id from invoice page: ", customerId)}
      {console.log("invoice id from invoice page: ", invoiceId)}

      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-semibold">Invoice Details </h2>
        <div className="text-sm">({invoiceId})</div>
        <div className="mt-4">
          <Row type="flex">
            <Col span={4} className="font-bold border border-gray-300 p-3">
              Product
            </Col>
            <Col span={4} className="font-bold border border-gray-300 p-3">
              Total Selling Price
            </Col>
            <Col span={4} className="font-bold border border-gray-300 p-3">
              Quantity
            </Col>
            <Col span={4} className="font-bold border border-gray-300 p-3">
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
                  <Row key={inv.id} type="flex">
                    <Col span={4} className=" border border-gray-300 p-3">
                      {i.product}
                    </Col>
                    <Col span={4} className=" border border-gray-300 p-3">
                      {i.totalSellingCost}
                    </Col>
                    <Col span={4} className=" border border-gray-300 p-3">
                      {i.quantity}
                    </Col>
                    <Col span={4} className=" border border-gray-300 p-3">
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
              <Row key={invoice[0].invoiceId} type="flex">
                <Col span={4}></Col>
                <Col span={4}></Col>
                <Col span={4} className="border border-gray-300 p-3">
                  Total Balance
                </Col>
                <Col span={4} className="border border-gray-300 p-3">
                  {invoice[0].totalBalance}
                </Col>
              </Row>

              <Row key={invoice[0].invoiceId} type="flex">
                <Col span={4}></Col>
                <Col span={4}></Col>
                <Col span={4} className="border border-gray-300 p-3">
                  <div className="font-semibold">Paid Amount</div>
                </Col>
                <Col span={4} className="border border-gray-300 p-3">
                  <div className="font-semibold">{invoice[0].paidAmount}</div>
                </Col>
              </Row>

              <Row key={invoice[0].invoiceId} type="flex">
                <Col span={4}></Col>
                <Col span={4}></Col>
                <Col span={4} className="border border-gray-300 p-3">
                  <div className="font-semibold">Left Balance</div>
                </Col>
                <Col span={4} className="border border-gray-300 p-3">
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
