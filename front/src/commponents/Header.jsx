import { useNavigate, NavLink } from 'react-router-dom';
import { FaRegHeart, FaTimes, FaTrash, FaArrowLeft } from "react-icons/fa";
import { AiOutlineCreditCard } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";
import { useState, useEffect, useCallback } from 'react';
import '../App.css';
import Card from './Card';

export default function Header() {
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState(null);
  const [showCardPage, setShowCardPage] = useState(false);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const API_URL = "https://rich-2-7dn1.onrender.com";

  const loadItems = useCallback(async (apKey, houseKey, lotKey, setter) => {
    try {
      const savedAp = JSON.parse(localStorage.getItem(apKey) || '{}');
      const savedHouse = JSON.parse(localStorage.getItem(houseKey) || '{}');
      const savedLot = JSON.parse(localStorage.getItem(lotKey) || '{}');

      const apIds = Object.keys(savedAp).filter(id => savedAp[id]);
      const houseIds = Object.keys(savedHouse).filter(id => savedHouse[id]);
      const lotIds = Object.keys(savedLot).filter(id => savedLot[id]);

      if (apIds.length === 0 && houseIds.length === 0 && lotIds.length === 0) {
        setter([]);
        return;
      }

      const [resAp, resHouse, resLot] = await Promise.all([
        fetch(`${API_URL}/apartments`),
        fetch(`${API_URL}/houses`),
        fetch(`${API_URL}/lot`)
      ]);

      const allAp = await resAp.json();
      const allHouse = await resHouse.json();
      const allLot = await resLot.json();

      const filteredAp = allAp.filter(item => apIds.includes(item.id.toString()));
      const filteredHouse = allHouse.filter(item => houseIds.includes(item.id.toString()));
      const filteredLot = allLot.filter(item => lotIds.includes(item.id.toString()));

      // Միավորում ենք բոլորը մեկ զանգվածում
      setter([...filteredAp, ...filteredHouse, ...filteredLot]);
    } catch (error) {
      console.error("Error loading items:", error);
    }
  }, [API_URL]);

  useEffect(() => {
    // Ավելացվել են 'likeLot' և 'cartLot' բանալիները
    loadItems('likedApartments', 'likedHouses', 'likeLot', setFavoriteItems);
    loadItems('cartItems', 'cartHouses', 'cartLot', setCartItems);

    const handleSync = () => {
      loadItems('likedApartments', 'likedHouses', 'likeLot', setFavoriteItems);
      loadItems('cartItems', 'cartHouses', 'cartLot', setCartItems);
    };

    window.addEventListener('storage', handleSync);
    return () => window.removeEventListener('storage', handleSync);
  }, [loadItems]);

  const removeItem = (id, apKey, houseKey, lotKey, setter) => {
    const savedAp = JSON.parse(localStorage.getItem(apKey) || '{}');
    const savedHouse = JSON.parse(localStorage.getItem(houseKey) || '{}');
    const savedLot = JSON.parse(localStorage.getItem(lotKey) || '{}');

    if (savedAp[id]) savedAp[id] = false;
    if (savedHouse[id]) savedHouse[id] = false;
    if (savedLot[id]) savedLot[id] = false;

    localStorage.setItem(apKey, JSON.stringify(savedAp));
    localStorage.setItem(houseKey, JSON.stringify(savedHouse));
    localStorage.setItem(lotKey, JSON.stringify(savedLot));

    loadItems(apKey, houseKey, lotKey, setter);
    window.dispatchEvent(new Event('storage'));
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    // Lot-ի դեպքում price-ի փոխարեն price_usd է
    const itemPrice = item.price || item.price_usd || 0;
    return sum + Number(itemPrice);
  }, 0);
  
  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith('http')) return img;
    return img.startsWith('/') ? img : `/${img}`;
  };

  return (
    <>
      <div className="header">
        <div className="box">
          <img
            src={process.env.PUBLIC_URL + '/images/logo/logo.jpg'}
            alt="Logo"
            onClick={() => { setShowCardPage(false); navigate('/'); }}
          />

          <div className="burger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <span>☰</span>}
          </div>

          <nav className={menuOpen ? "nav active" : "nav"}>
            <NavLink to="/apartment" onClick={() => { setShowCardPage(false); setMenuOpen(false); }}>Apartment</NavLink>
            <NavLink to="/house" onClick={() => { setShowCardPage(false); setMenuOpen(false); }}>House</NavLink>
            <NavLink to="/lot" onClick={() => { setShowCardPage(false); setMenuOpen(false); }}>Lot</NavLink>
            <NavLink to="/Realtor" onClick={() => { setShowCardPage(false); setMenuOpen(false); }}>Realtor</NavLink>
            <NavLink to="/contact" onClick={() => { setShowCardPage(false); setMenuOpen(false); }}>Contact</NavLink>
            
            <div className="icons mobile-icons">
              <div className="icon-wrapper">
                <FaRegHeart
                  className="icon-btn"
                  style={{ color: activePanel === 'heart' ? "red" : "#006837", cursor: 'pointer' }}
                  onClick={() => { 
                    setActivePanel(activePanel === 'heart' ? null : 'heart'); 
                    setMenuOpen(false); 
                  }}
                />
                {favoriteItems.length > 0 && <span className="badge">{favoriteItems.length}</span>}
              </div>

              <AiOutlineCreditCard
                className="icon-btn"
                style={{ color: showCardPage ? "#ff9900" : "#006837", cursor: 'pointer' }}
                onClick={() => { 
                  setShowCardPage(!showCardPage); 
                  setActivePanel(null); 
                  setMenuOpen(false); 
                }}
              />

              <div className="icon-wrapper">
                <FiShoppingCart
                  className="icon-btn"
                  style={{ color: activePanel === 'cart' ? "#ff9900" : "#006837", cursor: 'pointer' }}
                  onClick={() => { 
                    setActivePanel(activePanel === 'cart' ? null : 'cart'); 
                    setMenuOpen(false); 
                  }}
                />
                {cartItems.length > 0 && <span className="badge">{cartItems.length}</span>}
              </div>
            </div>
          </nav>
        </div>

        <div className={`side-panel ${activePanel === 'heart' ? 'open' : ''}`}>
          <div className="panel-header">
            <h3>Favorites ({favoriteItems.length})</h3>
            <FaTimes className="close-icon" onClick={() => setActivePanel(null)} />
          </div>
          <div className="panel-content">
            {favoriteItems.map(item => (
              <div key={item.id} className="fav-item">
                <img src={getImageUrl(item.image)} alt="" className="fav-img" />
                <div className="fav-info">
                  <h4>{item.location}</h4>
                  <p>{item.price || item.price_usd}$</p>
                </div>
                <FaTrash className="delete-fav" onClick={() => removeItem(item.id, 'likedApartments', 'likedHouses', 'likeLot', setFavoriteItems)} />
              </div>
            ))}
          </div>
        </div>

        <div className={`side-panel ${activePanel === 'cart' ? 'open' : ''}`}>
          <div className="panel-header">
            <h3>My Cart ({cartItems.length})</h3>
            <FaTimes className="close-icon" onClick={() => setActivePanel(null)} />
          </div>
          <div className="panel-content">
            {cartItems.map(item => (
              <div key={item.id} className="fav-item">
                <img src={getImageUrl(item.image)} alt="" className="fav-img" />
                <div className="fav-info">
                  <h4>{item.location}</h4>
                  <p>{item.price || item.price_usd}$</p>
                </div>
                <FaTrash className="delete-fav" onClick={() => removeItem(item.id, 'cartItems', 'cartHouses', 'cartLot', setCartItems)} />
              </div>
            ))}
            {cartItems.length > 0 && (
              <div className="cart-footer-btn">
                <p>Total: <strong>{totalPrice}$</strong></p>
                <button className="pay-now-btn" onClick={() => { setShowCardPage(true); setActivePanel(null); }}>
                  Pay Now
                </button>
              </div>
            )}
          </div>
        </div>

        {activePanel && <div className="overlay" onClick={() => setActivePanel(null)}></div>}
      </div>

      {showCardPage && (
        <div className="payment-overlay">
          <div className="payment-container">
            <button className="back-to-shop" onClick={() => setShowCardPage(false)}>
              <FaArrowLeft /> Back to Website
            </button>
            <div className="card-wrapper"><Card /></div>
          </div>
        </div>
      )}
    </>
  );
}