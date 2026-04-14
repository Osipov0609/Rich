import { useEffect, useState } from 'react'
import './css/lot.css'
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { FiShoppingCart } from "react-icons/fi";

export default function Lot() {
    const [lots, setLots] = useState([])
    const [loading, setLoading] = useState(true)

    const API_URL = "https://rich-2-7dn1.onrender.com";

    const [like, setLike] = useState(() => {
        const saved = localStorage.getItem('likeLot');
        return saved ? JSON.parse(saved) : {};
    });
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cartLot');
        return saved ? JSON.parse(saved) : {};
    });

    const toggleLikes = (id) => {
        const newLikes = { ...like, [id]: !like[id] };
        setLike(newLikes);
        localStorage.setItem('likeLot', JSON.stringify(newLikes));
    };

    const toggleCart = (id) => {
        const newCart = { ...cart, [id]: !cart[id] };
        setCart(newCart);
        localStorage.setItem('cartHouses', JSON.stringify(newCart));
        window.dispatchEvent(new Event('storage'));
    };

    useEffect(() => {
        const fetchData = fetch(`${API_URL}/lot`)
            .then(response => response.json());

        const timer = new Promise(resolve => setTimeout(resolve, 2000));

        Promise.all([fetchData, timer])
            .then(([data]) => {
                setLots(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching Lots:', error);
                setLoading(false);
            });
    }, [API_URL]);

    if (loading) {
        return (
            <p style={{ textAlign: 'center', fontSize: '45px', color: '#006837', marginTop: '250px' }}>
                Loading...
            </p>
        );
    }

    return (
        <div className='lot'>
            <div className="box">
                {lots.map((elem) => {

                    const isLiked = !!like[elem.id];
                    const isInCart = !!cart[elem.id];

                    const imageUrl = elem.image?.startsWith('http')
                        ? elem.image
                        : (elem.image?.startsWith('/') ? elem.image : `/${elem.image}`);

                    return (
                        <div key={elem.id} className="lot_result">

                            <div className="like-icon-container" onClick={() => toggleLikes(elem.id)} style={{ cursor: 'pointer' }}>
                                {isLiked ? (
                                    <FaHeart className='fafaHeart' style={{ color: 'red', fontSize: '22px' }} />
                                ) : (
                                    <FaRegHeart className='fafaHeart' style={{ color: 'white', fontSize: '22px' }} />
                                )}
                            </div>

                            <img src={imageUrl} alt={elem.location} />
                            <div style={{ padding: '15px' }}>
                                <p><strong>Price:</strong> ${elem.price_usd}</p>
                                <p><strong>Area:</strong> {elem.area_sqm}</p>
                                <p><strong>Location:</strong> {elem.location}</p>
                                <p style={{ fontSize: '18px', color: '#555' }}>Description: {elem.description}</p>
                                     
                                     <FiShoppingCart
                                            className='fafaShopping'
                                            style={{
                                                color: isInCart ? "#ff9900" : "black",
                                                cursor: 'pointer',
                                                fontSize: '24px'
                                            }}
                                            onClick={() => toggleCart(elem.id)}
                                        />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}