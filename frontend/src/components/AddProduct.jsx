import React, { useState } from "react";
import axios from "axios";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: "",
    productAvailable: false,
  });
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    try {
      const response = await axios.post("http://localhost:8080/api/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Product added successfully:", response.data);
      alert("Product added successfully! 🎉");
      
      // Reset form
      setProduct({
        name: "",
        brand: "",
        description: "",
        price: "",
        category: "",
        stockQuantity: "",
        releaseDate: "",
        productAvailable: false,
      });
      setImage(null);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container fade-in">
      <div className="text-center mb-5">
        <h2 className="form-title">
          <i className="bi bi-plus-circle me-2"></i>
          Add New Product
        </h2>
        <p className="text-muted">Fill in the details to add a new product to your store</p>
      </div>
      
      <form onSubmit={submitHandler}>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label">
                <i className="bi bi-tag me-1"></i>
                Product Name
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter product name"
                onChange={handleInputChange}
                value={product.name}
                name="name"
                required
              />
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label">
                <i className="bi bi-building me-1"></i>
                Brand
              </label>
              <input
                type="text"
                name="brand"
                className="form-input"
                placeholder="Enter brand name"
                value={product.brand}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="col-12">
            <div className="form-group">
              <label className="form-label">
                <i className="bi bi-info-circle me-1"></i>
                Description
              </label>
              <textarea
                className="form-input form-textarea"
                placeholder="Add detailed product description"
                value={product.description}
                name="description"
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="form-group">
              <label className="form-label">
                <i className="bi bi-currency-dollar me-1"></i>
                Price
              </label>
              <input
                type="number"
                className="form-input"
                placeholder="Enter price"
                onChange={handleInputChange}
                value={product.price}
                name="price"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="form-group">
              <label className="form-label">
                <i className="bi bi-grid-3x3-gap me-1"></i>
                Category
              </label>
              <select
                className="form-input form-select"
                value={product.category}
                onChange={handleInputChange}
                name="category"
                required
              >
                <option value="">Select category</option>
                <option value="Laptop">💻 Laptop</option>
                <option value="Headphone">🎧 Headphone</option>
                <option value="Mobile">📱 Mobile</option>
                <option value="Electronics">⚡ Electronics</option>
                <option value="Toys">🧸 Toys</option>
                <option value="Fashion">👕 Fashion</option>
              </select>
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group">
              <label className="form-label">
                <i className="bi bi-box-seam me-1"></i>
                Stock Quantity
              </label>
              <input
                type="number"
                className="form-input"
                placeholder="Available stock"
                onChange={handleInputChange}
                value={product.stockQuantity}
                name="stockQuantity"
                min="0"
                required
              />
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label">
                <i className="bi bi-calendar3 me-1"></i>
                Release Date
              </label>
              <input
                type="date"
                className="form-input"
                value={product.releaseDate}
                name="releaseDate"
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label">
                <i className="bi bi-image me-1"></i>
                Product Image
              </label>
              <input
                className="form-input"
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                required
              />
              {image && (
                <small className="text-success mt-1 d-block">
                  <i className="bi bi-check-circle me-1"></i>
                  {image.name} selected
                </small>
              )}
            </div>
          </div>
          
          <div className="col-12">
            <div className="form-check d-flex align-items-center gap-2">
              <input
                className="form-check-input"
                type="checkbox"
                name="productAvailable"
                id="productAvailable"
                checked={product.productAvailable}
                onChange={(e) =>
                  setProduct({ ...product, productAvailable: e.target.checked })
                }
              />
              <label className="form-check-label fw-medium" htmlFor="productAvailable">
                <i className="bi bi-check-circle me-1"></i>
                Product is available for sale
              </label>
            </div>
          </div>
          
          <div className="col-12">
            <button
              type="submit"
              className="btn btn-primary w-100 py-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  Adding Product...
                </>
              ) : (
                <>
                  <i className="bi bi-plus-circle me-2"></i>
                  Add Product
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
