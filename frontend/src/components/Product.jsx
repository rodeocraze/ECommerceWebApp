import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";
import UpdateProduct from "./UpdateProduct";

const Product = () => {
  const { id } = useParams();
  const { data, addToCart, removeFromCart, cart, refreshData } =
    useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/product/${id}`
        );
        setProduct(response.data);
        if (response.data.imageName) {
          fetchImage();
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchImage = async () => {
      const response = await axios.get(
        `http://localhost:8080/api/product/${id}/image`,
        { responseType: "blob" }
      );
      setImageUrl(URL.createObjectURL(response.data));
    };

    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/product/${id}`);
      removeFromCart(id);
      console.log("Product deleted successfully");
      alert("Product deleted successfully");
      refreshData();
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  const handlAddToCart = () => {
    addToCart(product);
    alert("Product added to cart");
  };
  
  if (!product) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <span className="ms-3">Loading product details...</span>
      </div>
    );
  }
  
  return (
    <>
      <div className="containers fade-in">
        <div className="product-image-container">
          <img
            className="left-column-img"
            src={imageUrl}
            alt={product.imageName}
          />
        </div>

        <div className="right-column">
          <div className="product-description">
            <div className="product-header">
              <span className="product-category-badge">
                <i className="bi bi-tag me-1"></i>
                {product.category || 'General'}
              </span>
              <div className="product-date">
                <small className="text-muted">
                  <i className="bi bi-calendar3 me-1"></i>
                  Listed: {new Date(product.releaseDate).toLocaleDateString()}
                </small>
              </div>
            </div>
            
            <h1 className="product-detail-title">
              {product.name}
            </h1>
            
            <p className="product-detail-brand">
              <i className="bi bi-building me-2"></i>
              by {product.brand}
            </p>
            
            <div className="mb-4">
              <h6 className="text-uppercase fw-bold text-muted mb-2">
                <i className="bi bi-info-circle me-1"></i>
                Product Description
              </h6>
              <p className="product-description">
                {product.description}
              </p>
            </div>
          </div>

          <div className="product-pricing-section">
            <div className="product-detail-price">
              <i className="bi bi-currency-dollar me-1"></i>
              {product.price?.toLocaleString()}
            </div>
            
            <div className="product-stock mb-4">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-box-seam text-muted"></i>
                <span>Stock Available: </span>
                <span className="stock-available fw-bold">
                  {product.stockQuantity} units
                </span>
              </div>
              
              <div className="mt-2">
                {product.productAvailable ? (
                  <span className="badge bg-success">
                    <i className="bi bi-check-circle me-1"></i>
                    In Stock
                  </span>
                ) : (
                  <span className="badge bg-danger">
                    <i className="bi bi-x-circle me-1"></i>
                    Out of Stock
                  </span>
                )}
              </div>
            </div>
            
            <div className="product-actions">
              <button
                className={`btn btn-lg cart-btn ${
                  !product.productAvailable ? "disabled" : ""
                }`}
                onClick={handlAddToCart}
                disabled={!product.productAvailable}
              >
                {product.productAvailable ? (
                  <>
                    <i className="bi bi-cart-plus me-2"></i>
                    Add to Cart
                  </>
                ) : (
                  <>
                    <i className="bi bi-x-circle me-2"></i>
                    Out of Stock
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="admin-actions mt-5 pt-4 border-top">
            <h6 className="text-uppercase fw-bold text-muted mb-3">
              <i className="bi bi-gear me-1"></i>
              Admin Actions
            </h6>
            <div className="d-flex gap-3">
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleEditClick}
              >
                <i className="bi bi-pencil-square me-2"></i>
                Update Product
              </button>
              
              <button
                className="btn btn-danger"
                type="button"
                onClick={deleteProduct}
              >
                <i className="bi bi-trash me-2"></i>
                Delete Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;