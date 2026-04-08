import { useNavigate, NavLink } from 'react-router-dom';
// import Logo from '../../public/images/logo/logo.jpg';
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

  const loadItems = useCallback(async (apKey, houseKey, setter) => {
    try {
      const savedAp = JSON.parse(localStorage.getItem(apKey) || '{}');
      const savedHouse = JSON.parse(localStorage.getItem(houseKey) || '{}');

      const apIds = Object.keys(savedAp).filter(id => savedAp[id]);
      const houseIds = Object.keys(savedHouse).filter(id => savedHouse[id]);

      if (apIds.length === 0 && houseIds.length === 0) {
        setter([]);
        return;
      }

      const [resAp, resHouse] = await Promise.all([
        fetch('http://localhost:5000/apartments'),
        fetch('http://localhost:5000/houses')
      ]);

      const allAp = await resAp.json();
      const allHouse = await resHouse.json();


      const filteredAp = allAp.filter(item => apIds.includes(item.id.toString()));
      const filteredHouse = allHouse.filter(item => houseIds.includes(item.id.toString()));

      setter([...filteredAp, ...filteredHouse]);
    } catch (error) {
      console.error("Error loading items:", error);
    }
  }, []);


  useEffect(() => {
    const handleSync = () => {
      loadItems('likedApartments', 'likedHouses', setFavoriteItems);
      loadItems('cartItems', 'cartHouses', setCartItems);
    };

    handleSync(); 
    window.addEventListener('storage', handleSync);
    return () => window.removeEventListener('storage', handleSync);
  }, [loadItems]);
  
  useEffect(() => {
    if (activePanel === 'heart') loadItems('likedApartments', 'likedHouses', setFavoriteItems);
    if (activePanel === 'cart') loadItems('cartItems', 'cartHouses', setCartItems);
  }, [activePanel, loadItems]);

  const removeItem = (id, apKey, houseKey, setter) => {
    const savedAp = JSON.parse(localStorage.getItem(apKey) || '{}');
    const savedHouse = JSON.parse(localStorage.getItem(houseKey) || '{}');

    if (savedAp[id]) savedAp[id] = false;
    if (savedHouse[id]) savedHouse[id] = false;

    localStorage.setItem(apKey, JSON.stringify(savedAp));
    localStorage.setItem(houseKey, JSON.stringify(savedHouse));
    
    loadItems(apKey, houseKey, setter);
    window.dispatchEvent(new Event('storage')); 
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + Number(item.price), 0);

  return (
    <>
      <div className="header">
        <div className="box">
          <img 
            src={process.env.PUBLIC_URL + '/images/logo/logo.jpg'} 
            alt="Logo" 
            onClick={() => { setShowCardPage(false); navigate('/'); }} 
            style={{ cursor: 'pointer' }} 
          />

          <nav>
            <NavLink to="/apartment" onClick={() => setShowCardPage(false)}>Apartment</NavLink>
            <NavLink to="/house" onClick={() => setShowCardPage(false)}>House</NavLink>
            <NavLink to="/lot" onClick={() => setShowCardPage(false)}>Lot</NavLink>
            <NavLink to="/Realtor" onClick={() => setShowCardPage(false)}>Realtor</NavLink>
            <NavLink to="/contact" onClick={() => setShowCardPage(false)}>Contact</NavLink>
          </nav>

          <div className="icons">
            <div className="icon-wrapper">
                <FaRegHeart
                className="icon-btn"
                style={{ color: activePanel === 'heart' ? "red" : "#006837", cursor: 'pointer' }}
                onClick={() => { setActivePanel(activePanel === 'heart' ? null : 'heart'); setShowCardPage(false); }}
                />
                {favoriteItems.length > 0 && <span className="badge">{favoriteItems.length}</span>}
            </div>

            <AiOutlineCreditCard 
              className="icon-btn"
              style={{ color: showCardPage ? "#ff9900" : "#006837", cursor: 'pointer' }}
              onClick={() => { setShowCardPage(!showCardPage); setActivePanel(null); }}
            />

            <div className="icon-wrapper">
                <FiShoppingCart
                className="icon-btn"
                style={{ color: activePanel === 'cart' ? "#ff9900" : "#006837", cursor: 'pointer' }}
                onClick={() => { setActivePanel(activePanel === 'cart' ? null : 'cart'); setShowCardPage(false); }}
                />
                {cartItems.length > 0 && <span className="badge">{cartItems.length}</span>}
            </div>


          </div>
        </div>

 
        <div className={`side-panel ${activePanel === 'heart' ? 'open' : ''}`}>
          <div className="panel-header">
            <h3>Favorites ({favoriteItems.length})</h3>
            <FaTimes className="close-icon" onClick={() => setActivePanel(null)} />
          </div>
          <div className="panel-content">
            {favoriteItems.map(item => (
              <div key={item.id} className="fav-item">
                <img src={item.image} alt="" className="fav-img" />
                <div className="fav-info">
                  <h4>{item.location}</h4>
                  <p>{item.price}$</p>
                </div>
                <FaTrash className="delete-fav" onClick={() => removeItem(item.id, 'likedApartments', 'likedHouses', setFavoriteItems)} />
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
                <img src={item.image} alt="" className="fav-img" />
                <div className="fav-info">
                  <h4>{item.location}</h4>
                  <p>{item.price}$</p>
                </div>
                <FaTrash className="delete-fav" onClick={() => removeItem(item.id, 'cartItems', 'cartHouses', setCartItems)} />
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
            <div className="card-wrapper">
              <Card />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

