import { useState, useEffect, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import './css/Apartament.css';

export default function Apartament() {
    const [data, setData] = useState([]);
    const [bedroom, setBedroom] = useState("");
    const [building, setBuilding] = useState("");
    const [furnishing, setFurnishing] = useState("");
    const [repair, setRepair] = useState("");
    const [type, setType] = useState("");

    // Backend-ի հասցեն
    const API_URL = "https://rich-2-7dn1.onrender.com";

    const [likes, setLikes] = useState(() => {
        const saved = localStorage.getItem('likedApartments');
        return saved ? JSON.parse(saved) : {};
    });

    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cartItems');
        return saved ? JSON.parse(saved) : {};
    });

    const toggleLike = (id) => {
        const newLikes = { ...likes, [id]: !likes[id] };
        setLikes(newLikes);
        localStorage.setItem('likedApartments', JSON.stringify(newLikes));
    };

    const toggleCart = (id) => {
        const newCart = { ...cart, [id]: !cart[id] };
        setCart(newCart);
        localStorage.setItem('cartItems', JSON.stringify(newCart));
        window.dispatchEvent(new Event('storage'));
    };

    const fetchData = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (bedroom) params.append('rooms', bedroom);
            if (building) params.append('building', building);
            if (furnishing) params.append('furnishing', furnishing);
            if (repair) params.append('repair', repair);
            if (type) params.append('type', type);

            const res = await fetch(`${API_URL}/apartments?${params.toString()}`);
            const result = await res.json();
            setData(result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [bedroom, building, furnishing, repair, type, API_URL]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="apartament">
            <div className="box">
                <nav className="navApartament">
                    <select value={bedroom} onChange={(e) => setBedroom(e.target.value)}>
                        <option value="">Rooms (All)</option>
                        <option value="One">One</option>
                        <option value="Two">Two</option>
                        <option value="Three">Three</option>
                    </select>

                    <select value={building} onChange={(e) => setBuilding(e.target.value)}>
                        <option value="">Building (All)</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>

                    <select value={furnishing} onChange={(e) => setFurnishing(e.target.value)}>
                        <option value="">Furnishing (All)</option>
                        <option value="Fully equipped">Fully equipped</option>
                        <option value="Partially equipped">Partially equipped</option>
                        <option value="Not equipped">Not equipped</option>
                    </select>

                    <select value={repair} onChange={(e) => setRepair(e.target.value)}>
                        <option value="">Repair (All)</option>
                        <option value="Repaired">Repaired</option>
                        <option value="Designer">Designer</option>
                        <option value="Euro">Euro</option>
                    </select>

                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="">Type (All)</option>
                        <option value="sale">Sale</option>
                        <option value="rent">Rent</option>
                    </select>
                </nav>

                <div className="results">
                    {data.map((item) => {
                        const apartmentImages = [
                            item.image, item.image2, item.image3, item.image4
                        ].filter(Boolean).map(img => {
                            // 1. Եթե հասցեն արդեն ամբողջական է (https://...), թողնում ենք նույնը
                            if (img.startsWith('https')) return img;

                            // 2. Քանի որ նկարները FRONTEND-ի public թղթապանակում են,
                            // մենք ՉՊԵՏՔ Է ավելացնենք API_URL (Backend-ի հասցեն)։
                            // Պարզապես համոզվում ենք, որ հասցեն սկսվում է թեք գծով /
                            return img.startsWith('/') ? img : `${img}`;
                        });

                        const isLiked = likes[item.id];
                        const isInCart = cart[item.id];

                        return (
                            <div key={item.id} className='apartament-card'>
                                <div className="like-icon-container" onClick={() => toggleLike(item.id)} style={{ cursor: 'pointer' }}>
                                    {isLiked ? (
                                        <FaHeart className='fafaHeart' style={{ color: 'red', fontSize: '22px' }} />
                                    ) : (
                                        <FaRegHeart className='fafaHeart' style={{ fontSize: '22px' }} />
                                    )}
                                </div>

                                <Swiper
                                    modules={[Navigation, Pagination]}
                                    navigation
                                    pagination={{ clickable: true }}
                                    loop={apartmentImages.length > 1}
                                    className="mySwiper"
                                >
                                    {apartmentImages.map((imgUrl, index) => (
                                        <SwiperSlide key={index}>
                                            <img src={imgUrl} alt={`${item.location} - ${index + 1}`} />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>

                                <div className="card-info">
                                    <h3>{item.location} - {item.price}$</h3>
                                    <div className="specs">
                                        <p><strong>Rooms:</strong> {item.rooms}</p>
                                        <p><strong>Repair:</strong> {item.repair}</p>
                                        <p><strong>Building:</strong> {item.building}</p>
                                        <p><strong>Furnishing:</strong> {item.furnishing}</p>
                                        <p><strong>Type:</strong> {item.type}</p>

                                        <FiShoppingCart
                                            className='fafaShopping'
                                            style={{
                                                color: isInCart ? "#ff9900" : "black",
                                                cursor: 'pointer',
                                                fontSize: '24px'
                                            }}
                                            onClick={() => toggleCart(item.id)}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}