import React, { useEffect, useState } from "react";
import Home from "./Home"
import axios from "axios";
// import { json } from "react-router-dom";
// import { BiSunFill, BiMoon } from "react-icons/bi";

const Navbar = ({ onSelectCategory, onSearch }) => {
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };
  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchResults,setShowSearchResults] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (value) => {
    try {
      const response = await axios.get("http://localhost:8080/api/products");
      setSearchResults(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = async (value) => {
    setInput(value);
    if (value.length >= 1) {
      setShowSearchResults(true)
    try {
      const response = await axios.get(
        `http://localhost:8080/api/product/search?keyword=${value}`
      );
      setSearchResults(response.data);
      setNoResults(response.data.length === 0);
      console.log(response.data);
    } catch (error) {
      console.error("Error searching:", error);
    }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
    }
  };

  
  // const handleChange = async (value) => {
  //   setInput(value);
  //   if (value.length >= 1) {
  //     setShowSearchResults(true);
  //     try {
  //       let response;
  //       if (!isNaN(value)) {
  //         // Input is a number, search by ID
  //         response = await axios.get(`http://localhost:8080/api/products/search?id=${value}`);
  //       } else {
  //         // Input is not a number, search by keyword
  //         response = await axios.get(`http://localhost:8080/api/products/search?keyword=${value}`);
  //       }

  //       const results = response.data;
  //       setSearchResults(results);
  //       setNoResults(results.length === 0);
  //       console.log(results);
  //     } catch (error) {
  //       console.error("Error searching:", error.response ? error.response.data : error.message);
  //     }
  //   } else {
  //     setShowSearchResults(false);
  //     setSearchResults([]);
  //     setNoResults(false);
  //   }
  // };

  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    setShowDropdown(false); // Close dropdown
    
    // Call the backend category search endpoint
    try {
      const response = await axios.get(`http://localhost:8080/api/products/category/${category}`);
      console.log("Category search results:", response.data);
      onSelectCategory(category, response.data); // Pass both category and results
    } catch (error) {
      console.error("Error searching by category:", error);
      onSelectCategory(category, []); // Pass empty array on error
    }
  };
  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDropdown]);

  const categories = [
    "Laptop",
    "Headphone",
    "Mobile",
    "Electronics",
    "Toys",
    "Fashion",
  ];
  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg fixed-top">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">
              <i className="bi bi-shop me-2"></i>
              ModernStore
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="/">
                    <i className="bi bi-house-door me-1"></i>
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/add_product">
                    <i className="bi bi-plus-circle me-1"></i>
                    Add Product
                  </a>
                </li>

                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded={showDropdown}
                    onClick={(e) => {
                      e.preventDefault();
                      setShowDropdown(!showDropdown);
                    }}
                  >
                    <i className="bi bi-grid-3x3-gap me-1"></i>
                    Categories
                  </a>

                  <ul className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => {
                          setSelectedCategory("");
                          onSelectCategory("", null); // Show all products
                          setShowDropdown(false); // Close dropdown
                        }}
                      >
                        <i className="bi bi-grid me-2"></i>
                        Show All Products
                      </button>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    {categories.map((category) => (
                      <li key={category}>
                        <button
                          className="dropdown-item"
                          onClick={() => handleCategorySelect(category)}
                        >
                          <i className="bi bi-tag me-2"></i>
                          {category}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
              
              <div className="d-flex align-items-center gap-3">
                <button className="theme-btn" onClick={() => toggleTheme()}>
                  {theme === "dark-theme" ? (
                    <i className="bi bi-sun-fill"></i>
                  ) : (
                    <i className="bi bi-moon-fill"></i>
                  )}
                </button>
                
                <div className="search-container">
                  <input
                    className="form-control"
                    type="search"
                    placeholder="Search products..."
                    aria-label="Search"
                    value={input}
                    onChange={(e) => handleChange(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                  />
                  {showSearchResults && (
                    <ul className="list-group">
                      {searchResults.length > 0 ? (  
                          searchResults.map((result) => (
                            <li key={result.id} className="list-group-item">
                              <a href={`/product/${result.id}`} className="search-result-link">
                                <div className="d-flex align-items-center">
                                  <i className="bi bi-search me-2"></i>
                                  <span>{result.name}</span>
                                </div>
                              </a>
                            </li>
                          ))
                      ) : (
                        noResults && (
                          <li className="list-group-item text-center text-muted">
                            <i className="bi bi-exclamation-circle me-2"></i>
                            No products found
                          </li>
                        )
                      )}
                    </ul>
                  )}
                </div>
                
                <div className="cart">
                  <a href="/cart" className="nav-link">
                    <i className="bi bi-cart3 me-1"></i>
                    Cart
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
