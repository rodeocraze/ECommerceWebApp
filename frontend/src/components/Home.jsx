import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png"

const Home = ({ selectedCategory, categoryProducts }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched]);

  useEffect(() => {
    if (data && data.length > 0) {
      const fetchImagesAndUpdateProducts = async () => {
        const updatedProducts = await Promise.all(
          data.map(async (product) => {
            try {
              const response = await axios.get(
                `http://localhost:8080/api/product/${product.id}/image`,
                { responseType: "blob" }
              );
              const imageUrl = URL.createObjectURL(response.data);
              return { ...product, imageUrl };
            } catch (error) {
              console.error(
                "Error fetching image for product ID:",
                product.id,
                error
              );
              return { ...product, imageUrl: "placeholder-image-url" };
            }
          })
        );
        setProducts(updatedProducts);
      };

      fetchImagesAndUpdateProducts();
    }
  }, [data]);

  // Use categoryProducts from backend search if available, otherwise use client-side filtering
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const updateFilteredProducts = async () => {
      if (categoryProducts !== null) {
        // Fetch images for category search results
        const productsWithImages = await Promise.all(
          categoryProducts.map(async (product) => {
            try {
              const response = await axios.get(
                `http://localhost:8080/api/product/${product.id}/image`,
                { responseType: "blob" }
              );
              const imageUrl = URL.createObjectURL(response.data);
              return { ...product, imageUrl };
            } catch (error) {
              console.error("Error fetching image for product ID:", product.id, error);
              return { ...product, imageUrl: "placeholder-image-url" };
            }
          })
        );
        setFilteredProducts(productsWithImages);
      } else if (selectedCategory) {
        // Client-side filtering for backward compatibility
        setFilteredProducts(products.filter((product) => product.category === selectedCategory));
      } else {
        // Show all products
        setFilteredProducts(products);
      }
    };

    updateFilteredProducts();
  }, [categoryProducts, selectedCategory, products]);

  if (isError) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <img src={unplugged} alt="Error" style={{ width: '120px', height: '120px', opacity: 0.5 }}/>
        </div>
        <h2 className="empty-state-title">Oops! Something went wrong</h2>
        <p className="empty-state-description">
          We're having trouble loading the products. Please try again later.
        </p>
      </div>
    );
  }
  
  return (
    <>
      <div className="grid fade-in">
        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <i className="bi bi-box-seam"></i>
            </div>
            <h2 className="empty-state-title">No Products Available</h2>
            <p className="empty-state-description">
              {selectedCategory 
                ? `No products found in the ${selectedCategory} category.`
                : "We're currently updating our inventory. Please check back soon!"
              }
            </p>
          </div>
        ) : (
          filteredProducts.map((product, index) => {
            const { id, brand, name, price, productAvailable, imageUrl } = product;
            
            return (
              <div
                className="card fade-in"
                key={id}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Link
                  to={`/product/${id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="position-relative">
                    <img
                      src={imageUrl}
                      alt={name}
                      className="card-img-top"
                    />
                    {!productAvailable && (
                      <div className="position-absolute top-0 end-0 m-2">
                        <span className="badge bg-danger">
                          <i className="bi bi-x-circle me-1"></i>
                          Out of Stock
                        </span>
                      </div>
                    )}
                    {productAvailable && (
                      <div className="position-absolute top-0 end-0 m-2">
                        <span className="badge bg-success">
                          <i className="bi bi-check-circle me-1"></i>
                          Available
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="card-body">
                    <div className="product-category mb-2">
                      <i className="bi bi-tag me-1"></i>
                      {product.category || 'General'}
                    </div>
                    
                    <h5 className="card-title">
                      {name}
                    </h5>
                    
                    <p className="card-brand">
                      <i className="bi bi-building me-1"></i>
                      {brand}
                    </p>
                    
                    <div className="home-cart-price">
                      <h5 className="mb-3">
                        <i className="bi bi-currency-dollar me-1"></i>
                        {price?.toLocaleString()}
                      </h5>
                    </div>
                    
                    <button
                      className="btn-hover"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (productAvailable) {
                          addToCart(product);
                          // Show a brief success indicator
                          const btn = e.target;
                          const originalText = btn.innerHTML;
                          btn.innerHTML = '<i class="bi bi-check me-1"></i>Added!';
                          btn.style.background = 'linear-gradient(135deg, #22c55e, #10b981)';
                          setTimeout(() => {
                            btn.innerHTML = originalText;
                            btn.style.background = '';
                          }, 1500);
                        }
                      }}
                      disabled={!productAvailable}
                    >
                      {productAvailable ? (
                        <>
                          <i className="bi bi-cart-plus me-1"></i>
                          Add to Cart
                        </>
                      ) : (
                        <>
                          <i className="bi bi-x-circle me-1"></i>
                          Out of Stock
                        </>
                      )}
                    </button>
                  </div>
                </Link>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default Home;
