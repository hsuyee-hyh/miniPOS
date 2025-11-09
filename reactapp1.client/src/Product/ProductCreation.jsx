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

    lvl1Unit: -1,
    stockLvl1: -1,
    lvl1BuyingPrice: 0,
    lvl1SellingPrice: 0,

    numberOfUnit2: -1,

    lvl2Unit: "",
    stockLvl2: -1,
    lvl2BuyingPrice: 0,
    lvl2SellingPrice: 0,
    // stockLvl2PerUnit1: 0,

    numberOfUnit3: -1,

    lvl3Unit: "",
    stockLvl3: -1,
    lvl3BuyingPrice: 0,
    lvl3SellingPrice: 0,
    // stockLvl3PerUnit2: 0,

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

      form.append("Lvl1Unit", formData.lvl1Unit);
      form.append("StockLvl1", formData.stockLvl1);
      form.append("Lvl1BuyingPrice", formData.lvl1BuyingPrice);
      form.append("Lvl1SellingPrice", formData.lvl1SellingPrice);

      form.append("NumberOfUnit2", formData.numberOfUnit2);

      form.append("Lvl2Unit", formData.lvl2Unit);
      form.append("StockLvl2", formData.stockLvl2);
      form.append("Lvl2BuyingPrice", formData.lvl2BuyingPrice);
      form.append("Lvl2SellingPrice", formData.lvl2SellingPrice);
      // form.append("StockLvl2PerUnit1", formData.stockLvl2PerUnit1);

      form.append("NumberOfUnit2", formData.numberOfUnit2);

      form.append("Lvl3Unit", formData.lvl3Unit);
      form.append("StockLvl3", formData.stockLvl3);
      form.append("Lvl3BuyingPrice", formData.lvl3BuyingPrice);
      form.append("Lvl3SellingPrice", formData.lvl3SellingPrice);
      // form.append("StockLvl3PerUnit2", formData.stockLvl3PerUnit2);

      form.append("ProductOwner", formData.productOwner);

      if (formData.imgUrl) {
        form.append("ImgUrl", formData.imgUrl);
      }

      // const productRequestData = {
      //   productName: formData.productName,
      //   productDescription: formData.productDescription,
      //   buyingPrice: formData.buyingPrice,
      //   sellingPrice: formData.sellingPrice,
      //   category: formData.category,

      //   lvl1Unit: formData.lvl1Unit,
      //   stockLvl1: formData.stockLvl1,
      //   lvl1SellingPrice: formData.lvl1SellingPrice,

      //   numberOfUnit2: formData.numberOfUnit2,

      //   lvl2Unit: formData.lvl2Unit,
      //   stockLvl2: formData.stockLvl2,
      //   lvl2SellingPrice: formData.lvl2SellingPrice,

      //   numberOfUnit3: formData.numberOfUnit3,

      //   lvl3Unit: formData.lvl3Unit,
      //   stockLvl3: formData.stockLvl3,
      //   lvl3SellingPrice: formData.lvl3SellingPrice,

      //   imgUrl: formData.imgUrl,

      //   productOwner: formData.productOwner,
      // };

      console.log("productFormData: ", form);

      const response = await fetch(
        "https://localhost:7299/api/product/create-product",
        {
          method: "POST",
          // body: JSON.stringify({productRequestData: productRequestData}),
          body: form,
        }
      );
      console.log("create product response is ", response);
      const data = await response.json();

      if (data.error) {
        setErrorMsg(data.error);
        return;
      }
      if (data.success) {
        navigate("/products");
      }
      // if (response.ok) {
      //   message.success(data.message);
      //   navigate("/products");
      //   setSuccessMsg(data.message);
      //   setFormData({
      //     productName: "",
      //     productDescription: "",
      //     buyingPrice: "",
      //     sellingPrice: "",
      //     category: "",
      //     stockLvl1: "",
      //     stockLvl2: "",
      //     stockLvl3: "",
      //     imgUrl: "",
      //     productOwner: "",
      //   });
      // } else {
      //   message.error(data.message);
      //   setErrorMsg(data.message);
      //   return;
      // }
    } catch (err) {
      setErrorMsg("Something went wrong while submitting the Product Form.");
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
        <div className="flex flex-col justify-center items-center sm:w-[400px] md:w-[600px]">
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
            <div className="flex flex-col space-y-3 w-full">
              <Form.Item
                label="Product Name"
                name="productName"
                rules={[
                  { required: true, message: "Please input product name" },
                ]}
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
                  {
                    required: true,
                    message: "Please input product description",
                  },
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
                  {
                    required: true,
                    message: "Please input the buying price!",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Buying Price"
                  name="buyingPrice"
                  value={formData.buyingPrice}
                  onChange={(value) =>
                    handleAntdDataChange(value, "buyingPrice")
                  }
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                label="Selling Price"
                name="sellingPrice"
                rules={[
                  {
                    required: true,
                    message: "Please input the selling price!",
                  },
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
                rules={[
                  { required: true, message: "Please select a category!" },
                ]}
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

              {/* level 1 */}
              <div>
                <div className="flex flex-row justify-between">
                  <Form.Item
                    label="Level 1 (Unit)"
                    name="lvl1Unit"
                    rules={[
                      {
                        required: true,
                        message: "Please input Unit for Stock Level 1",
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      placeholder="Level 1 (Unit)"
                      name="lvl1Unit"
                      value={formData.lvl1Unit}
                      onChange={handleChange}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Stock Level 1"
                    name="stockLvl1"
                    rules={[
                      {
                        required: true,
                        message: "Please input stock level 1",
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder="Stock Level 1"
                      name="stockLvl1"
                      value={formData.stockLvl1}
                      onChange={(value) =>
                        handleAntdDataChange(value, "stockLvl1")
                      }
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </div>
                <Form.Item
                  label="Level 1 Buying Price"
                  name="lvl1BuyingPrice"
                  rules={[
                    {
                      required: true,
                      message: "Please input the buying price!",
                    },
                  ]}
                  className="mt-0"
                >
                  <InputNumber
                    placeholder="Level 1 Buying Price"
                    name="lvl1SellingPrice"
                    value={formData.lvl1BuyingPrice}
                    onChange={(value) =>
                      handleAntdDataChange(value, "lvl1BuyingPrice")
                    }
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item
                  label="Level 1 Selling Price"
                  name="lvl1SellingPrice"
                  rules={[
                    {
                      required: true,
                      message: "Please input the selling price!",
                    },
                  ]}
                  className="mt-0"
                >
                  <InputNumber
                    placeholder="Level 1 Selling Price"
                    name="lvl1SellingPrice"
                    value={formData.lvl1SellingPrice}
                    onChange={(value) =>
                      handleAntdDataChange(value, "lvl1SellingPrice")
                    }
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>

              {/* level 2 */}
              <div>
                <Form.Item label="Number of Unit 2" name="numberOfUnit2">
                  <Input
                    type="text"
                    placeholder="Number of Units for level 2"
                    name="numberOfUnit2"
                    value={formData.numberOfUnit2}
                    onChange={handleChange}
                  />
                </Form.Item>
                <div className="flex flex-row justify-between">
                  <Form.Item label="Level 2 (Unit)" name="lvl2Unit">
                    <Input
                      type="text"
                      placeholder="Level 2 (Unit)"
                      name="lvl2Unit"
                      value={formData.lvl2Unit}
                      onChange={handleChange}
                    />
                  </Form.Item>
                  <Form.Item label="Stock Level 2" name="stockLvl2">
                    <InputNumber
                      placeholder="Stock Level 2"
                      name="stockLvl2"
                      value={formData.stockLvl2}
                      onChange={(value) =>
                        handleAntdDataChange(value, "stockLvl2")
                      }
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </div>
                <Form.Item
                  label="Level 2 Buying Price"
                  name="lvl2BuyingPrice"
                  className="mt-0"
                >
                  <InputNumber
                    placeholder="Level 2 Buying Price"
                    name="lvl2BuyingPrice"
                    value={formData.lvl2BuyingPrice}
                    onChange={(value) =>
                      handleAntdDataChange(value, "lvl2BuyingPrice")
                    }
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item
                  label="Level 2 Selling Price"
                  name="lvl2SellingPrice"
                  className="mt-0"
                >
                  <InputNumber
                    placeholder="Level 2 Selling Price"
                    name="lvl2SellingPrice"
                    value={formData.lvl2SellingPrice}
                    onChange={(value) =>
                      handleAntdDataChange(value, "lvl2SellingPrice")
                    }
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>

              {/* level 3 */}
              <div>
                <Form.Item label="Number of Unit 3" name="numberOfUnit3">
                  <Input
                    type="text"
                    placeholder="Number of Units for level 3"
                    name="numberOfUnit3"
                    value={formData.numberOfUnit3}
                    onChange={handleChange}
                  />
                </Form.Item>
                <div className="flex flex-row justify-between">
                  <Form.Item label="Level 3 (Unit)" name="lvl3Unit">
                    <Input
                      type="text"
                      placeholder="Level 3 (Unit)"
                      name="lvl3Unit"
                      value={formData.lvl3Unit}
                      onChange={handleChange}
                    />
                  </Form.Item>
                  <Form.Item label="Stock Level 3" name="stockLvl3">
                    <InputNumber
                      placeholder="Stock Level 3"
                      name="stockLvl3"
                      value={formData.stockLvl3}
                      onChange={(value) =>
                        handleAntdDataChange(value, "stockLvl3")
                      }
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </div>
                <Form.Item
                  label="Level 3 Buying Price"
                  name="lvl3BuyingPrice"
                  className="mt-0"
                >
                  <InputNumber
                    placeholder="Level 3 Buying Price"
                    name="lvl3BuyingPrice"
                    value={formData.lvl3BuyingPrice}
                    onChange={(value) =>
                      handleAntdDataChange(value, "lvl3BuyingPrice")
                    }
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item
                  label="Level 3 Selling Price"
                  name="lvl3SellingPrice"
                  className="mt-0"
                >
                  <InputNumber
                    placeholder="Level 3 Selling Price"
                    name="lvl3SellingPrice"
                    value={formData.lvl3SellingPrice}
                    onChange={(value) =>
                      handleAntdDataChange(value, "lvl3SellingPrice")
                    }
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>

              {/* imgUrl file  */}

              {/* product owner  */}
              <Form.Item
                label="Product Owner"
                name="productOwner"
                rules={[
                  {
                    required: true,
                    message: "Please select a product owner!",
                  },
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
      </div>
    </>
  );
}
