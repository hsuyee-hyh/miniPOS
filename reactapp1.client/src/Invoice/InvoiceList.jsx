import { PageContainer } from "@ant-design/pro-components";
import Navbar from "../Layout/Navbar";
import { useEffect, useState } from "react";
import { Alert, Table } from "antd";

export default function InvoiceList() {
  const [invoiceList, setInvoiceList] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMsg(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [errorMsg]);

  useEffect(() => {
    try {
      const fetchInvoices = async () => {
        const invoiceResponse = await fetch(
          `https://localhost:7299/api/invoice/list`
        );
        const invoiceResponseData = await invoiceResponse.json();
        if (invoiceResponseData.error) {
          setErrorMsg(invoiceResponseData.error);
          return;
        }
        setInvoiceList(invoiceResponseData.invoiceList);
      };
      fetchInvoices();
    } catch (err) {
      console.error(err);
    }
  }, []);

  const columns = [
    {
      title: "Invoice ID",
      dataIndex: "invoiceId",
      key: "invoiceId",
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Total Balance",
      dataIndex: "totalBalance",
      key: "totalBalance",
    },
    {
      title: "Paid Amount",
      dataIndex: "paidAmount",
      key: "paidAmount",
    },
    {
      title: "Left Amount",
      dataIndex: "remainingBalance",
      key: "remainingBalance",
    },
    // {
    // title: "Previous Left Amount",
    // dataIndex: "prevLeftAmount",
    // key: "prevLeftAmount",
    // },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => {
        const date = new Date(text);
        return date.toLocaleString();
      }
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
    },
  ];
  return (
    <>
      <Navbar />
      <PageContainer>
        <div className=" px-20">
          {errorMsg && <Alert message={errorMsg} type="error" showIcon />}
          <h1 className="text-xl font-bold mb-4">Invoice List</h1>
          <Table dataSource={invoiceList} columns={columns} rowKey="invoiceListId" />
        </div>
      </PageContainer>
    </>
  );
}
