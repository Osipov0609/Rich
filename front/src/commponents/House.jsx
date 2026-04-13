import { useState, useEffect, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { FiShoppingCart } from "react-icons/fi";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import './css/House.css';

export default function Home() {
    const [data, setData] = useState([]);
    const [bedroom, setBedroom] = useState("");
    const [building, setBuilding] = useState("");
    const [furnishing, setFurnishing] = useState("");
    const [repair, setRepair] = useState("");
    const [type, setType] = useState("");
    const [propertyType, setPropertyType] = useState("");

    // Քո Render սերվերի հասցեն
    const API_URL = "https://rich-2-7dn1.onrender.com";

    const [like, setLike] = useState(() => {
        const saved = localStorage.getItem('likedHouses');
        return saved ? JSON.parse(saved) : {};
    });

    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cartHouses');
        return saved ? JSON.parse(saved) : {};
    });

    const toggleLikes = (id) => {
        const newLikes = { ...like, [id]: !like[id] };
        setLike(newLikes);
        localStorage.setItem('likedHouses', JSON.stringify(newLikes));
    };

    const toggleCart = (id) => {
        const newCart = { ...cart, [id]: !cart[id] };
        setCart(newCart);
        localStorage.setItem('cartHouses', JSON.stringify(newCart));
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
            if (propertyType) params.append('propertyType', propertyType);

            const res = await fetch(`${API_URL}/houses?${params.toString()}`);
            const result = await res.json();
            setData(result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [bedroom, building, furnishing, repair, type, propertyType, API_URL]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="house">
            <div className="box">
                <nav className="navHouse">
                    <select value={bedroom} onChange={(e) => setBedroom(e.target.value)}>
                        <option value="">Rooms (All)</option>
                        <option value="One">One</option>
                        <option value="Two">Two</option>
                        <option value="Three">Three</option>
                        <option value="Four">Four</option>
                    </select>

                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="">Type (All)</option>
                        <option value="sale">Sale</option>
                        <option value="rent">Rent</option>
                    </select>

                    <select value={building} onChange={(e) => setBuilding(e.target.value)}>
                        <option value="">Building (All)</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>

                    <select value={furnishing} onChange={(e) => setFurnishing(e.target.value)}>
                        <option value="">Furnishing (All)</option>
                        <option value="furnished">Furnished</option>
                        <option value="unfurnished">Unfurnished</option>
                    </select>

                    <select value={repair} onChange={(e) => setRepair(e.target.value)}>
                        <option value="">Repair (All)</option>
                        <option value="Repaired">Repaired</option>
                        <option value="Designer">Designer</option>
                        <option value="Old">Old</option>
                    </select>

                    <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                        <option value="">Property Type (All)</option>
                        <option value="house">House</option>
                        <option value="townhouse">Townhouse</option>
                    </select>
                </nav>

                <div className="results">
                    {data.map((item) => {
                        // Ուղղված build-ի սխալները
                        const isLiked = !!like[item.id];
                        const isInCart = !!cart[item.id];

                        // Ուղղված նկարների հասցեները
                        const houseImages = [
                            item.image, item.image2, item.image3,
                            item.image4, item.image5, item.image6
                        ].filter(Boolean).map(img => {
                            if (img.startsWith('http')) return img;
                            const cleanImgPath = img.startsWith('/') ? img.slice(1) : img;
                            return `${API_URL}/${cleanImgPath}`;
                        });

                        return (
                            <div key={item.id} className='house-card'>
                                <div className="like-icon-container" onClick={() => toggleLikes(item.id)} style={{ cursor: 'pointer' }}>
                                    {isLiked ? (
                                        <FaHeart className='fafaHeart' style={{ color: 'red', fontSize: '22px' }} />
                                    ) : (
                                        <FaRegHeart className='fafaHeart' style={{ color: 'white', fontSize: '22px' }} />
                                    )}
                                </div>

                                <Swiper
                                    modules={[Navigation, Pagination]}
                                    navigation
                                    pagination={{ clickable: true }}
                                    loop={houseImages.length > 1}
                                    className="mySwiper"
                                >
                                    {houseImages.map((imgUrl, index) => (
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
                                        <p><strong>Property:</strong> {item.propertyType}</p>

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