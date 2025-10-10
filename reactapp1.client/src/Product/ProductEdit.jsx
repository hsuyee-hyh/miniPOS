import { Card, Form, Input, message, Spin, Button, Select } from "antd";
import Navbar from "../Layout/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { jaJPIntl } from "@ant-design/pro-components";

export default function ProductEdit() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [foundProduct, setFoundProduct] = useState(null);
  const [formData, setFormData] = useState({
    productName: "",
    buyingPrice: "",
    sellingPrice: "",
    category: "",
    stockLvl1: "",
    stockLvl2: "",
    stockLvl3: "",
    productOwner: "",
    imgUrl: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch product data
  useEffect(() => {
    fetch(`https://localhost:7299/api/product/${productId}`)
      .then((response) => {
        if (!response.ok) {
          message.error("Failed to fetch product.");
          return;
        }
        return response.json();
      })
      .then((data) => {
        console.log("product edit from api: ", data);
        setFoundProduct(data);
        setFormData(data); // preload formData with API data
      })
      .catch((error) => {
        setErrorMsg(error.message);
        message.error("Error fetching the product details: " + error.message);
      });
  }, [productId]);


  useEffect(() => {
    if(errorMsg){
        const timer = setTimeout(() => {
            setErrorMsg("");
        }, 3000);
        return () => clearTimeout(timer);
    }
  })

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle select change
  const handleSelectDataChange = (value, fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // Optional: handle form submit
  const handleSubmit = async () => {
    console.log("Submit formData: ", formData);
    try {
      const form = new FormData();

      // match properties name in c#
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
        `https://localhost:7299/api/product/edit/${foundProduct.id}`,
        {
          method: "POST",
          body: form,
        }
      );
      const data = response.json();
      if (response.ok) {
        message.success(data.message);
        navigate(`/product/${foundProduct.id}`);
      } else {
        message.error(data.message);
        setErrorMsg(data.message);
        return;
      }
    } catch (err) {
      message.error("Failed to fetch product. Please try again.");
      setErrorMsg(err.error);
      return;
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center mt-4">
        {errorMsg && (
          <div className="text-red-500 font-semibold mb-4">{errorMsg}</div>
        )}

        {!foundProduct && !errorMsg && <Spin tip="Loading..." />}

        {foundProduct && (
          <Card variant="outlined" style={{ width: 800 }}>
            <Form encType="multipart/form-data">
              <div className="flex flex-row justify-between items-start">
                {/* Product Image */}
                <img
                  src={`https://localhost:7299${formData.imgUrl}`}
                  alt={formData.productName}
                  className="w-[200px] h-[200px] object-cover rounded-2xl mb-4"
                />

                {/* Left Column: Product Info */}
                <div className="flex flex-col my-2 mx-4 space-y-2 flex-1">
                  <div className="flex flex-row items-center">
                    <label className="w-32">Product Name: </label>
                    <Input
                      name="productName"
                      value={formData.productName}
                      onChange={handleChange}
                      style={{ flex: 1 }}
                    />
                  </div>

                  <div className="flex flex-row items-center">
                    <label className="w-32">Buying Price: </label>
                    <Input
                      name="buyingPrice"
                      value={formData.buyingPrice}
                      onChange={handleChange}
                      style={{ flex: 1 }}
                    />
                  </div>

                  <div className="flex flex-row items-center">
                    <label className="w-32">Selling Price: </label>
                    <Input
                      name="sellingPrice"
                      value={formData.sellingPrice}
                      onChange={handleChange}
                      style={{ flex: 1 }}
                    />
                  </div>

                  <div className="flex flex-row items-center">
                    <label className="w-32">Category: </label>

                    <Select
                      defaultValue="--Please select a category--"
                      value={formData.category}
                      onChange={(value) =>
                        handleSelectDataChange(value, "category")
                      }
                      options={[
                        { value: "snacks", label: "Snacks" },
                        { value: "drinks", label: "Drinks" },
                        { value: "oil", label: "oil" },
                        { value: "salt", label: "salt" },
                      ]}
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>

                {/* Right Column: Stock & Owner Info */}
                <div className="flex flex-col my-2 mx-4 space-y-2 flex-1">
                  <div className="flex flex-row items-center">
                    <label className="w-32">Stock Level 1: </label>
                    <Input
                      name="stockLvl1"
                      value={formData.stockLvl1}
                      onChange={handleChange}
                      style={{ flex: 1 }}
                    />
                  </div>

                  <div className="flex flex-row items-center">
                    <label className="w-32">Stock Level 2: </label>
                    <Input
                      name="stockLvl2"
                      value={formData.stockLvl2}
                      onChange={handleChange}
                      style={{ flex: 1 }}
                    />
                  </div>

                  <div className="flex flex-row items-center">
                    <label className="w-32">Stock Level 3: </label>
                    <Input
                      name="stockLvl3"
                      value={formData.stockLvl3}
                      onChange={handleChange}
                      style={{ flex: 1 }}
                    />
                  </div>

                  <div className="flex flex-row items-center">
                    <label className="w-32">Product Owner: </label>
                    <Select
                      defaultValue="-- Please select owner --"
                      value={formData.productOwner}
                      style={{flex: 1 }}
                      onChange={(value) =>
                        handleAntdDataChange(value, "productOwner")
                      }
                      options={[
                        { value: "U Win Hone", label: "U Win Hone" },
                        { value: "Bay Bay", label: "Bay Bay" },
                      ]}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end mt-2">
                <Button type="primary" onClick={handleSubmit}>
                  Save Changes
                </Button>
              </div>
            </Form>
          </Card>
        )}
      </div>
    </>
  );
}
