import { useEffect, useState } from "react";
import Navbar from "../Layout/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Input, Form, Button, message, Select, Spin } from "antd";
import { useForm } from "antd/es/form/Form";

export default function CustomerOrderEdit() {
  const { customerId, orderId } = useParams();
  const [form] = useForm();
  const navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState("");
  const [foundOrder, setFoundOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [availableUnits, setAvailableUnits] = useState([]);

  const [formData, setFormData] = useState({
    id: orderId,
    product: "",
    sellingPrice: 0,
    additionalSellingPrice: 0,
    labourCost: 0,
    vehicleCost: 0,
    totalSellingCost: 0,
    quantity: 0,
    unitLevel: "",
    customerId: customerId,
  });

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => {
        setErrorMsg("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  });

  // fetch product
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

  // define total selling cost
  useEffect(() => {
    const fetchOrder = async () => {
      const response = await fetch(
        `https://localhost:7299/api/order/customer/${customerId}/edit/${orderId}`
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message);
      }

      setFoundOrder(data);
      setFormData(data);
    };
    fetchOrder();
  }, [orderId]);

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

    // ant design form value
    form.setFieldsValue({
      totalSellingCost: total,
    });
  }, [
    formData.sellingPrice,
    formData.additionalSellingPrice,
    formData.labourCost,
    formData.vehicleCost,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If the field should be numeric, convert to number
    const newValue = [
      "sellingPrice",
      "additionalSellingPrice",
      "totalSellingCost",
      "quantity",
    ].includes(name)
      ? Number(value)
      : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSelectDataChange = (value, option, fieldName) => {
    const selected = products.find((x) => x.id == option.key);

    const unitList = [];
    if (selected) {
      if (selected.lvl1Unit) unitList.push(selected.lvl1Unit);
      if (selected.lvl2Unit) unitList.push(selected.lvl2Unit);
      if (selected.lvl3Unit) unitList.push(selected.lvl3Unit);
    }
    setAvailableUnits(unitList);

    // antdesign field value
    form.setFieldsValue({
      product: value,
      sellingPrice: selected ? selected.sellingPrice : 0,
      productId: selected ? selected.id : -1,
      unitLevel: selected ? unitList : null,
    });

    // update FormData
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
      sellingPrice: selected ? selected.sellingPrice : 0,
      productId: selected ? selected.id : -1,
      unitLevel: selected ? unitList : null,
    }));
  };

  const handleSubmit = () => {
    console.log(formData);
    try {
      const custForm = new FormData();
      custForm.append("id", orderId);
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

      fetch(
        `https://localhost:7299/api/order/edit/customer/${customerId}/order/${orderId}`,
        {
          method: "PUT",
          body: custForm,
        }
      )
        .then((response) => {
          if (!response.ok) {
            message.error("Failed to update the order");
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
      <div className="flex flex-col items-center mt-4">
        {errorMsg && (
          <div className="text-red-500 font-semibold mb-4">{errorMsg}</div>
        )}

        {foundOrder && (
          <Card variant="outlined" className="w-[400px] md:w-[500px]">
            <Form form={form}>
              <div className="flex flex-col my-2 mx-4 space-y-2 flex-1">
                <div className="flex flex-row items-center">
                  <label className="w-32">Product: </label>

                  <Select
                    name="product"
                    allowClear
                    style={{ flex: 1 }}
                    placeholder="Select product"
                    showSearch
                    optionFilterProp="children"
                    loading={loading}
                    notFoundContent={
                      loading ? <Spin size="small" /> : "No products found"
                    }
                    value={formData.product}
                    onChange={(value, option) =>
                      handleSelectDataChange(value, option, "product")
                    }
                  >
                    {products.map((product) => (
                      <Select.Option
                        key={product.id}
                        value={product.productName}
                      >
                        {product.productName}
                      </Select.Option>
                    ))}
                  </Select>
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
                  <label className="w-32">Additional Selling Price: </label>
                  <Input
                    name="additionalSellingPrice"
                    value={formData.additionalSellingPrice}
                    onChange={handleChange}
                    style={{ flex: 1 }}
                  />
                </div>

                <div className="flex flex-row items-center">
                  <label className="w-32">Labour Cost: </label>
                  <Input
                    name="labourCost"
                    value={formData.labourCost}
                    onChange={handleChange}
                    style={{ flex: 1 }}
                  />
                </div>

                <div className="flex flex-row items-center">
                  <label className="w-32">Vehicle Cost: </label>
                  <Input
                    name="vehicleCost"
                    value={formData.vehicleCost}
                    onChange={handleChange}
                    style={{ flex: 1 }}
                  />
                </div>

                <div className="flex flex-row items-center">
                  <label className="w-32">Total Selling Cost: </label>
                  <Input
                    name="totalSellingCost"
                    value={formData.totalSellingCost}
                    // onChange={handleChange}
                    readOnly
                    style={{ flex: 1 }}
                  />
                </div>

                <div className="flex flex-row items-center space-x-2">
                  
                    <label>Quantity:</label>
                    <Input
                      name="quantity"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          quantity: e.target.value,
                        }))
                      }
                      style={{ flex: 1 }}
                    />
              

                  <div>
                    <label>Select</label>
                    <Select
                      name="unitLevel"
                      allowClear
                      style={{ flex: 1 }}
                      placeholder="Select Unit"
                      showSearch
                      optionFilterProp="children"
                      loading={loading}
                      notFoundContent={
                        loading ? <Spin size="small" /> : "No unit found"
                      }
                      value={formData.unitLevel} // selected unit
                      onChange={(value) =>
                        setFormData((prev) => ({ ...prev, unitLevel: value }))
                      }
                    >
                      {availableUnits.map((unit) => (
                        <Select.Option key={unit} value={unit}>
                          {/* {unit} */}
                          unit
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end mt-2">
                  <Button type="primary" onClick={handleSubmit}>
                    Save Change
                  </Button>
                </div>
              </div>
            </Form>
          </Card>
        )}
      </div>
    </>
  );
}
