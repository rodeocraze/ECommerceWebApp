import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import axios from "axios";
import CheckoutPopup from "./CheckoutPopup";
import { Button } from 'react-bootstrap';

const Cart = () => {
  const { cart, removeFromCart , clearCart } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartImage, setCartImage] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchImagesAndUpdateCart = async () => {
      console.log("Cart", cart);
      try {
        const response = await axios.get("http://localhost:8080/api/products");
        const backendProductIds = response.data.map((product) => product.id);

        const updatedCartItems = cart.filter((item) => backendProductIds.includes(item.id));
        const cartItemsWithImages = await Promise.all(
          updatedCartItems.map(async (item) => {
            try {
              const response = await axios.get(
                `http://localhost:8080/api/product/${item.id}/image`,
                { responseType: "blob" }
              );
              const imageFile = await converUrlToFile(response.data, response.data.imageName);
              setCartImage(imageFile)
              const imageUrl = URL.createObjectURL(response.data);
              return { ...item, imageUrl };
            } catch (error) {
              console.error("Error fetching image:", error);
              return { ...item, imageUrl: "placeholder-image-url" };
            }
          })
        );
        console.log("cart",cart)
        setCartItems(cartItemsWithImages);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    if (cart.length) {
      fetchImagesAndUpdateCart();
    }
  }, [cart]);

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  const converUrlToFile = async (blobData, fileName) => {
    const file = new File([blobData], fileName, { type: blobData.type });
    return file;
  }

  const handleIncreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) => {
      if (item.id === itemId) {
        if (item.quantity < item.stockQuantity) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          alert("Cannot add more than available stock");
        }
      }
      return item;
    });
    setCartItems(newCartItems);
  };
  

  const handleDecreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) =>
      item.id === itemId
        ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
        : item
    );
    setCartItems(newCartItems);
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    const newCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(newCartItems);
  };

  const handleCheckout = async () => {
    try {
      for (const item of cartItems) {
        const { imageUrl, imageName, imageData, imageType, quantity, ...rest } = item;
        const updatedStockQuantity = item.stockQuantity - item.quantity;
  
        const updatedProductData = { ...rest, stockQuantity: updatedStockQuantity };
        console.log("updated product data", updatedProductData)
  
        const cartProduct = new FormData();
        cartProduct.append("imageFile", cartImage);
        cartProduct.append(
          "product",
          new Blob([JSON.stringify(updatedProductData)], { type: "application/json" })
        );
  
        await axios
          .put(`http://localhost:8080/api/product/${item.id}`, cartProduct, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            console.log("Product updated successfully:", (cartProduct));
          })
          .catch((error) => {
            console.error("Error updating product:", error);
          });
      }
      clearCart();
      setCartItems([]);
      setShowModal(false);
    } catch (error) {
      console.log("error during checkout", error);
    }
  };

  return (
    <div className="cart-container fade-in">
      <div className="shopping-cart">
        <div className="cart-header">
          <h1 className="cart-title">
            <i className="bi bi-bag-heart me-3"></i>
            Shopping Cart
          </h1>
          {cartItems.length > 0 && (
            <span className="badge bg-primary fs-6">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>
        
        {cartItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <i className="bi bi-cart-x"></i>
            </div>
            <h3 className="empty-state-title">Your cart is empty</h3>
            <p className="empty-state-description">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <a href="/" className="btn btn-primary">
              <i className="bi bi-arrow-left me-2"></i>
              Continue Shopping
            </a>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className="item fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="d-flex align-items-center gap-4 w-100">
                    <div className="cart-item-image-container">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="cart-item-image"
                      />
                    </div>
                    
                    <div className="cart-item-details flex-grow-1">
                      <div className="cart-item-brand text-muted mb-1">
                        <i className="bi bi-building me-1"></i>
                        {item.brand}
                      </div>
                      <h5 className="cart-item-name mb-2">{item.name}</h5>
                                        <div className="cart-item-price">
                    <i className="bi bi-currency-dollar me-1"></i>
                    {item.price?.toLocaleString()}
                  </div>
                    </div>

                    <div className="cart-item-quantity">
                      <button
                        className="quantity-btn minus-btn"
                        type="button"
                        onClick={() => handleDecreaseQuantity(item.id)}
                        disabled={item.quantity <= 1}
                      >
                        <i className="bi bi-dash"></i>
                      </button>
                      <input
                        className="quantity-input"
                        type="number"
                        value={item.quantity}
                        readOnly
                      />
                      <button
                        className="quantity-btn plus-btn"
                        type="button"
                        onClick={() => handleIncreaseQuantity(item.id)}
                        disabled={item.quantity >= item.stockQuantity}
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>

                    <div className="cart-item-total text-center">
                      <div className="fw-bold text-primary fs-5">
                        <i className="bi bi-currency-dollar me-1"></i>
                        {(item.price * item.quantity)?.toLocaleString()}
                      </div>
                      <small className="text-muted">
                        {item.quantity} × {item.price?.toLocaleString()}
                      </small>
                    </div>
                    
                    <button
                      className="cart-item-remove"
                      onClick={() => handleRemoveFromCart(item.id)}
                      title="Remove item"
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <div className="cart-total">
                <span>Total Amount:</span>
                <span className="fw-bold">
                  <i className="bi bi-currency-dollar me-1"></i>
                  {totalPrice?.toLocaleString()}
                </span>
              </div>
              
              <div className="d-flex gap-3">
                <button
                  className="btn btn-outline-primary flex-fill"
                  onClick={() => window.location.href = '/'}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Continue Shopping
                </button>
                
                <button
                  className="checkout-btn flex-fill"
                  onClick={() => setShowModal(true)}
                >
                  <i className="bi bi-credit-card me-2"></i>
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      
      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItems}
        totalPrice={totalPrice}
        handleCheckout={handleCheckout}
      />
    </div>
  );
};

export default Cart;
