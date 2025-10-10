import { PageContainer } from "@ant-design/pro-components";
import Navbar from "../Layout/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Card, message, Modal } from "antd";
import { useEffect, useState } from "react";

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [foundProduct, setFoundProduct] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        // console.log("product details from api: ", data);
        setFoundProduct(data);
      })
      .catch((error) => {
        setErrorMsg(error.message);
        message.error("Error fetching the product details: ", error.message);
      });
  }, [productId]);

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => {
        setErrorMsg("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    fetch(`https://localhost:7299/api/product/delete/${productId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          message.error("Failed to delete that product.");
          return;
        }
        return response.json();
      })
      .then((data) => {})
      .catch((error) => {
        setErrorMsg(error.message);
        message.error("Error fetching the product details: ", error.message);
      });
    navigate("/products");
  };

  const handleCancel = () => {
    navigate(`/product/${foundProduct.id}`);
  };

  return (
    <>
      <Navbar />
      <PageContainer>
        <div className="flex flex-col items-center">
          {errorMsg && (
            <Alert type="error" message={errorMsg} className="mb-4" />
          )}

          <div className="flex justify-end w-full max-w-[800px] mb-4">
            <Button
              type="primary"
              onClick={() => navigate(`/product/edit/${foundProduct.id}`)}
              className="mr-2"
            >
              Edit
            </Button>
            <Button
              onClick={showModal}
              style={{ backgroundColor: "#ffffff", borderColor: "#3396D3" }}
            >
              Delete
            </Button>

            <Modal
              title="Are you sure to delete?"
              closable={{ "aria-label": "Custom Close Button" }}
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            ></Modal>
          </div>
          {foundProduct && (
            <Card variant="outlined" style={{ width: 800 }}>
              <div className="flex flex-row justify-between items-center">
                <img
                  src={`https://localhost:7299${foundProduct.imgUrl}`}
                  alt={foundProduct.productName}
                  className="w-[200px] h-[200px] object-cover rounded-2xl mb-4"
                />

                <div className="flex flex-col my-8 mx-15 space-y-2">
                  <div className="flex flex-row">
                    <span className="text-md font-semibold mr-2">Name: </span>
                    <span>{foundProduct.productName}</span>
                  </div>

                  <div className="flex flex-row">
                    <span className="text-md font-semibold mr-2">
                      Buying Price:{" "}
                    </span>
                    <span>{foundProduct.buyingPrice}</span>
                  </div>

                  <div className="flex flex-row">
                    <span className="text-md font-semibold mr-2">
                      Selling Price:{" "}
                    </span>
                    <span>{foundProduct.sellingPrice}</span>
                  </div>

                  <div className="flex flex-row">
                    <span className="text-md font-semibold mr-2">
                      Category:{" "}
                    </span>
                    <span>{foundProduct.category}</span>
                  </div>
                </div>

                <div className="flex flex-col my-8 mx-15 space-y-2 ">
                  <div className="flex flex-row">
                    <span className="text-md font-semibold mr-2">
                      Stock Level 1:{" "}
                    </span>
                    <span>{foundProduct.stockLvl1}</span>
                  </div>

                  <div className="flex flex-row">
                    <span className="text-md font-semibold mr-2">
                      Stock Level 2:{" "}
                    </span>
                    <span>{foundProduct.stockLvl2}</span>
                  </div>

                  <div className="flex flex-row">
                    <span className="text-md font-semibold mr-2">
                      Stock Level 3:{" "}
                    </span>
                    <span>{foundProduct.stockLvl3}</span>
                  </div>

                  <div className="flex flex-row">
                    <span className="text-md font-semibold mr-2">
                      Product Owner:{" "}
                    </span>
                    <span>{foundProduct.productOwner}</span>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </PageContainer>
    </>
  );
}
