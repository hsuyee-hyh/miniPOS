import {
  Alert,
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Spin,
} from "antd";
import Navbar from "../Layout/Navbar";
import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import { useNavigate, useParams } from "react-router-dom";

export default function CustomerOrderCreation() {
  const { customerId } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [foundProduct, setFoundProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form] = useForm();
  const [formData, setFormData] = useState({
    product: "",
    sellingPrice: "",
    additionalSellingPrice: 0,
    productId: "",
    labourCost: "",
    vehicleCost: "",
    totalSellingCost: "",
    quantity: "",
  });

  // errorMsg
  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => {
        setErrorMsg("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  // fetchProducts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://localhost:7299/api/product/products"
        );
        const data = await response.json();
        if (!response.ok) {
          setErrorMsg(data.message);
          setLoading(false);
        }
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setErrorMsg("Failed to fetch product: ", err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // calculate total selling cost
  useEffect(() => {
    const sellingPrice = parseFloat(formData.sellingPrice) || 0;
    const additionalSellingPrice =
      parseFloat(formData.additionalSellingPrice) || 0;
    const labourCost = parseFloat(formData.labourCost) || 0;
    const vehicleCost = parseFloat(formData.vehicleCost) || 0;

    const total =
      sellingPrice + additionalSellingPrice + labourCost + vehicleCost;

    setFormData((prev) => ({
      ...prev,
      totalSellingCost: total,
    }));

    form.setFieldsValue({
      totalSellingCost: total,
    });
  }, [
    formData.sellingPrice,
    formData.additionalSellingPrice,
    formData.labourCost,
    formData.vehicleCost,
  ]);

  const handleSelectDataChange = (value, option, fieldName) => {
    const selected = products.find((x) => x.id == option.key);
    setSelectedProduct(selected);

    // antdesign field value
    form.setFieldsValue({
      product: value,
      sellingPrice: selected ? selected.sellingPrice : 0,
      productId: selected ? selected.id : -1,
    });

    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
      sellingPrice: selected ? selected.sellingPrice : 0,
      productId: selected ? selected.id : -1,
    }));
  };

  const handleDataChange = (value, fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = (values) => {
    // console.log(formData);
    try {
      const custForm = new FormData();
      custForm.append("Product", formData.product);
      custForm.append("SellingPrice", formData.sellingPrice);
      custForm.append(
      "AdditionalSellingPrice",
      formData.additionalSellingPrice
      );
      custForm.append("ProductId", formData.productId);
      custForm.append("LabourCost", formData.labourCost);
      custForm.append("VehicleCost", formData.vehicleCost);
      custForm.append("TotalSellingCost", formData.totalSellingCost);
      custForm.append("Quantity", formData.quantity);
      custForm.append("CustomerId", customerId);
      // console.log("customForm is ", custForm);

      // custForm.append("Product", values.product);
      // custForm.append("SellingPrice", values.sellingPrice);
      // custForm.append(
        // "AdditionalSellingPrice",
        // values.additionalSellingPrice || 0
      // );
      // custForm.append("ProductId", values.productId);
      // custForm.append("LabourCost", values.labourCost);
      // custForm.append("VehicleCost", values.vehicleCost);
      // custForm.append("TotalSellingCost", values.totalSellingCost);
      // custForm.append("Quantity", values.quantity);

      fetch(
        `https://localhost:7299/api/order/create-order`,
        {
          method: "POST",
          body: custForm,
        }
      )
        .then((response) => {
          if (!response.ok) {
            message.error("Failed to create the order");
          }
          response.json();
        })
        .then((data) => {
          console.log(data);
          navigate(`/customer/${customerId}`);
        });
    } catch (err) {
      setErrorMsg("Failed to create the order with ", err.message);
    }
  };
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center my-7">
        <h1 className="text-xl font-bold mb-4">Create an Order</h1>
        {errorMsg && <Alert message={errorMsg} type="error" className="mb-5" />}

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="flex flex-col space-y-3 w-44 md:w-96">
            <input type="hidden" name="customerId" value={customerId} />

            <Form.Item
              label="Product"
              name="product"
              rules={[{ required: true, message: "Please select one product" }]}
            >
              <Select
                name="product"
                allowClear
                style={{ width: "100%" }}
                placeholder="Select tags"
                showSearch
                optionFilterProp="children"
                loading={loading}
                notFoundContent={
                  loading ? <Spin size="small" /> : "No products found"
                }
                onChange={(value, option) =>
                  handleSelectDataChange(value, option, "product")
                }
              >
                {products.map((product) => (
                  <Select.Option key={product.id} value={product.productName}>
                    {product.productName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Selling Price"
              name="sellingPrice"
              rules={[
                { required: true, message: "Please input the selling price!" },
              ]}
            >
              <Input
                placeholder="Selling Price"
                readOnly
                value={formData.sellingPrice}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              label="Product Id"
              name="productId"
              rules={[{ required: true }]}
            >
              <InputNumber value={formData.productId} readOnly style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label="Additional Selling Price"
              name="additionalSellingPrice"
              rules={[
                {
                  required: false,
                  message: "Please input the additional buying price!",
                },
              ]}
            >
              <InputNumber
                placeholder="Additional Selling Price"
                name="additionalSellingPrice"
                value={formData.additionalSellingPrice}
                onChange={(value) =>
                  handleDataChange(value, "additionalSellingPrice")
                }
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              label="Labour Cost"
              name="labourCost"
              rules={[
                { required: true, message: "Please input the labour cost!" },
              ]}
            >
              <InputNumber
                placeholder="Labour Cost"
                name="labourCost"
                value={formData.labourCost}
                onChange={(value) => handleDataChange(value, "labourCost")}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              label="Vehicle Cost"
              name="vehicleCost"
              rules={[
                { required: true, message: "Please input the vehicle cost!" },
              ]}
            >
              <InputNumber
                placeholder="Vehicle Cost"
                name="vehicleCost"
                value={formData.vehicleCost}
                onChange={(value) => handleDataChange(value, "vehicleCost")}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              label="Total Selling Cost"
              name="totalSellingCost"
              rules={[
                {
                  required: true,
                  message: "Please input the total selling cost!",
                },
              ]}
            >
              <InputNumber
                placeholder="Total Selling Cost"
                name="totalSellingCost"
                value={formData.totalSellingCost}
                readOnly
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[
                { required: true, message: "Please input the quantity!" },
              ]}
            >
              <InputNumber
                placeholder="Quantity"
                name="quantity"
                value={formData.quantity}
                onChange={(value) => handleDataChange(value, "quantity")}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Button type="primary" htmlType="submit" block>
              Create Order
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}
