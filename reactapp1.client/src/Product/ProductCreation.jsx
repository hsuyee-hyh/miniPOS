import { Alert, Button, Form, Input, InputNumber, message, Select } from "antd";
import Navbar from "../Layout/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCreation() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    buyingPrice: "",
    sellingPrice: "",
    category: "",
    stockLvl1: "",
    stockLvl2: "",
    stockLvl3: "",
    imgUrl: "",
    productOwner: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => {
        setErrorMsg("");
      }, 3000);
      return () => clearTimeout(timer);
    }

    if (successMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg, successMsg]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAntdDataChange = (value, name) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, imgUrl: file });
    }
  };

  const handleSubmit = async () => {
   
    try {
      const form = new FormData();

      // append all fields
      form.append("ProductName", formData.productName);
      form.append("ProductDescription", formData.productDescription);
      form.append("BuyingPrice", formData.buyingPrice);
      form.append("SellingPrice", formData.sellingPrice);
      form.append("Category", formData.category);
      form.append("StockLvl1", formData.stockLvl1);
      form.append("StockLvl2", formData.stockLvl2);
      form.append("StockLvl3", formData.stockLvl3);
      form.append("ProductOwner", formData.productOwner);

      if (formData.imgUrl) {
        form.append("ImgUrl", formData.imgUrl); 
      }

      const response = await fetch(
        "https://localhost:7299/api/product/create-product",
        {
          method: "POST",
          // body: JSON.stringify(formData),
          body: form,
          // headers: { "Content-Type": "application/json" },
        }
      );
      console.log("create product response is ", response);
      const data = await response.json();
      if (response.ok) {
        message.success(data.message);
        navigate("/products");
        setSuccessMsg(data.message);
        setFormData({
          productName: "",
          productDescription: "",
          buyingPrice: "",
          sellingPrice: "",
          category: "",
          stockLvl1: "",
          stockLvl2: "",
          stockLvl3: "",
          imgUrl: "",
          productOwner: "",
        });
      } else {
        message.error(data.message);
        setErrorMsg(data.message);
        return;
      }
    } catch (err) {
      message.error("Failed to create product. Please try again.");
      console.error("Error during product creation:", err);
      return;
    }
  };
  return (
    <>
      <Navbar></Navbar>
      <div className="flex flex-col items-center my-7">
        {errorMsg && <Alert message={errorMsg} type="error" className="mb-5" />}
        {successMsg && (
          <Alert message={successMsg} type="success" className="mb-5" />
        )}

        {/* product creation form  */}
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          className="flex flex-col  md:flex-row "
          encType="multipart/form-data"
        >
          {/* image section  */}
          <div className="mr-10 mb-5">
            {!formData.imgUrl && (
              <div className="w-[200px] h-[200px] bg-gray-400 rounded-2xl relative">
                <label className="absolute bottom-2 left-14 bg-black opacity-70 text-white px-3 py-2 rounded-xl cursor-pointer hover:bg-blue-500">
                  Add Image
                  <input
                    type="file"
                    name="imgUrl"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            )}
            {/* preview image  */}

            {formData.imgUrl && (
              <div>
                <div className="relative">
                  <img
                    src={URL.createObjectURL(formData.imgUrl)}
                    alt="Preview"
                    className="w-[200px] h-[200px] rounded-2xl object-cover mt-4 relative"
                  />

                  <div className="absolute bottom-2 left-14">
                    {/* <Button className="bg-black opacity-70 text-black hover:bg-blue-500 "> */}
                    <label className="bg-black opacity-70 text-white px-3 py-2 rounded-xl cursor-pointer hover:bg-blue-500">
                      Add Image
                      <input
                        type="file"
                        name="imgUrl"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                      />
                    </label>
                    {/* </Button> */}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* form section  */}
          <div className="flex flex-col space-y-3 w-44 md:w-96">
            <Form.Item
              label="Product Name"
              name="productName"
              rules={[{ required: true, message: "Please input product name" }]}
            >
              <Input
                type="text"
                placeholder="Product Name"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
              />
            </Form.Item>

            <Form.Item
              label="Description"
              name="productDescription"
              rules={[
                { required: true, message: "Please input product description" },
              ]}
            >
              <Input
                type="text"
                placeholder="Description"
                name="productDescription"
                value={formData.productDescription}
                onChange={handleChange}
              />
            </Form.Item>

            <Form.Item
              label="Buying Price"
              name="buyingPrice"
              rules={[
                { required: true, message: "Please input the buying price!" },
              ]}
            >
              <InputNumber
                placeholder="Buying Price"
                name="buyingPrice"
                value={formData.buyingPrice}
                onChange={(value) => handleAntdDataChange(value, "buyingPrice")}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              label="Selling Price"
              name="sellingPrice"
              rules={[
                { required: true, message: "Please input the selling price!" },
              ]}
            >
              <InputNumber
                placeholder="Selling Price"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={(value) =>
                  handleAntdDataChange(value, "sellingPrice")
                }
                style={{ width: "100%" }}
              />
            </Form.Item>

            {/* category selection */}
            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Please select a category!" }]}
            >
              <Select
                defaultValue="--Please select a category--"
                onChange={(value) => handleAntdDataChange(value, "category")}
                options={[
                  { value: "snacks", label: "Snacks" },
                  { value: "drinks", label: "Drinks" },
                  { value: "oil", label: "oil" },
                  { value: "salt", label: "salt" },
                ]}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              label="Stock Level 1"
              name="stockLvl1"
              rules={[
                { required: true, message: "Please input stock level 1" },
              ]}
            >
              <InputNumber
                placeholder="Stock Level 1"
                name="stockLvl1"
                value={formData.stockLvl1}
                onChange={(value) => handleAntdDataChange(value, "stockLvl1")}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              label="Stock Level 2"
              name="stockLvl2"
              rules={[
                { required: false, message: "Please input stock level 2" },
              ]}
            >
              <InputNumber
                placeholder="Stock Level 2"
                name="stockLvl2"
                value={formData.stockLvl2}
                onChange={(value) => handleAntdDataChange(value, "stockLvl2")}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              label="Stock Level 3"
              name="stockLvl3"
              rules={[
                { required: false, message: "Please input stock level 3" },
              ]}
            >
              <InputNumber
                placeholder="Stock Level 3"
                name="stockLvl3"
                value={formData.stockLvl3}
                onChange={(value) => handleAntdDataChange(value, "stockLvl3")}
                style={{ width: "100%" }}
              />
            </Form.Item>

            {/* imgUrl file  */}

            {/* product owner  */}
            <Form.Item
              label="Product Owner"
              name="productOwner"
              rules={[
                { required: true, message: "Please select a product owner!" },
              ]}
            >
              <Select
                defaultValue="-- Please select a product owner --"
                style={{ width: "100%", marginBottom: 15 }}
                onChange={(value) =>
                  handleAntdDataChange(value, "productOwner")
                }
                options={[
                  { value: "U Win Hone", label: "U Win Hone" },
                  { value: "Bay Bay", label: "Bay Bay" },
                ]}
              />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              Create Product
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}
