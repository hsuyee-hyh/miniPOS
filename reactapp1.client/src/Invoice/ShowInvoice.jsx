import { useParams } from "react-router-dom";
import Navbar from "../Layout/Navbar";
import { useEffect, useState } from "react";
import { message } from "antd";


export default function ShowInvoice(){

    const { customerId } = useParams();

    const [errorMsg, setErrorMsg] = useState("");
    const [orders, setOrders] = useState([]);

    // fetch order 
    useEffect(() => {
        const fetchOrder = async () => {
            try{
                const response = await fetch(
                    `https://localhost:7299/api/order/orders?customerId=${customerId}`
                );
                const data = await response.json();
                console.log("orders data from invoice page: ", data);
                if(!response.ok){
                    setErrorMsg(data.message);
                    message.error(data.message);
                    return;
                }
                setOrders(data);
            }catch(err){
                console.log("error from fetch order: ", err);
                message.error("Failed to fetch orders");
            }
        };
        fetchOrder();
    }, [customerId]);

    // insert invoice data
    

    const columns = [
        {
            title: 'Order No',
            dataIndex: 'id',
            key: 'id',
        }
    ];
    return (
        <>
        {console.log("customer id from invoice page: ", customerId)}
            <Navbar/>
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Invoice Details</h2>
            </div>
        </>
    );
}