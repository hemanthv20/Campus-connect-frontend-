import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import ChatIcon from "./ChatIcon";
import { API_BASE_URL } from "../config/api";
import "./css/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [genderFilter, setGenderFilter] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!searchTerm.trim()) return;
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/users/search/${searchTerm}?gender=${genderFilter}`
      );
      if (response.status === 200) {
        const data = await response.json();
        setSearchResult(true);
        // Close dropdown and clear search
        setShowDropdown(false);
        setSearchTerm("");
        setAutocompleteResults([]);
        // Navigate to user profile if found
        navigate(`/profile/${data.username}`);
      } else if (response.status === 404) {
        setSearchResult(false);
      }
    } catch (error) {
      setSearchResult(false);
    }
  };

  // Handle clicking on a suggestion
  const handleSuggestionClick = (username) => {
    // Close dropdown and clear search
    setShowDropdown(false);
    setSearchTerm("");
    setAutocompleteResults([]);
    setSearchResult(null);
    // Navigate to profile
    navigate(`/profile/${username}`);
  };

  // Function to fetch autocomplete results when the search term changes
  useEffect(() => {
    const fetchAutocompleteResults = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/users/autocomplete/${searchTerm}?gender=${genderFilter}`
        );
        if (response.ok) {
          const data = await response.json();
          setAutocompleteResults(data);
          setShowDropdown(data.length > 0);
        }
      } catch (error) {
        setAutocompleteResults([]);
        setShowDropdown(false);
      }
    };

    if (searchTerm !== "" && searchTerm.length >= 2) {
      const debounceTimer = setTimeout(() => {
        fetchAutocompleteResults();
      }, 300);
      
      return () => clearTimeout(debounceTimer);
    } else {
      setAutocompleteResults([]);
      setShowDropdown(false);
    }
  }, [searchTerm, genderFilter]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle ESC key to close dropdown
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setShowDropdown(false);
        setSearchTerm("");
        setAutocompleteResults([]);
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  return (
    <div>
      {user ? (
        <nav className="navbar">
          <a className="navbar-brand">
            <Link to="/">
              <img src={require("../assets/Campus.png")} height={"35px"} alt="Campus Connect" />
            </Link>
          </a>
          <div className="nav">
            <div className="search-container" ref={searchContainerRef}>
              <form className="form-inline" onSubmit={handleSearch}>
                <input
                  className="form-control mr-sm-2"
                  type="search"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <button
                  className="btn btn-outline-success my-2 my-sm-0"
                  type="submit"
                >
                  Search
                </button>
              </form>
              {showDropdown && autocompleteResults.length > 0 && (
                <div className="autocomplete-results">
                  {autocompleteResults.map((username, index) => (
                    <div
                      key={index}
                      className="autocomplete-item"
                      onClick={() => handleSuggestionClick(username)}
                    >
                      {username}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {searchResult === true && <p>User found</p>}
            {searchResult === false && <p>Invalid user</p>}

            <Link
              to={`/profile/${user.username}`}
              className="profile-picture-set"
            >
              {user.profile_picture ? (
                <img
                  src={user.profile_picture}
                  className="nav-profile-picture"
                  alt="Profile"
                />
              ) : (
                <img
                  src={require("../assets/placeholder.png")}
                  className="nav-profile-picture"
                  alt="Profile"
                />
              )}

              <a>@{user.username}</a>
            </Link>
            <Link to="/" className="nav-link">
              <a>Home</a>
            </Link>
            <Link to="/discover" className="nav-link">
              <a><i className="fi fi-rr-search"></i> Discover</a>
            </Link>
            <ChatIcon />
            {user.admin ? (
              <Link to="/admin" className="nav-link">
                <a>Admin</a>
              </Link>
            ) : null}
            <Link to="/" className="nav-link">
              <a onClick={handleLogout}>Logout</a>
            </Link>
          </div>
        </nav>
      ) : (
        <nav className="navbar">
          <Link to="/">
            <a className="navbar-brand">
              <img src={require("../assets/Campus.png")} height={"35px"} alt="Campus Connect" />
            </a>
          </Link>
          <div className="nav">
            <Link to="/login" className="nav-link">
              <a>Login</a>
            </Link>
            <Link to="/register" className="nav-link">
              <a>Register</a>
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}

export default Navbar;
