import { useEffect, useState } from 'react'
import './css/lot.css'

export default function Lot() {
    const [lots, setLots] = useState([])
    const [loading, setLoading] = useState(true)

    // Քո Render սերվերի հասցեն
    const API_URL = "https://rich-2-7dn1.onrender.com";

    useEffect(() => {
        // Փոխում ենք հասցեն իրական սերվերի հասցեով
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
                    const imageUrl = elem.image?.startsWith('http')
                        ? elem.image
                        : (elem.image?.startsWith('/') ? elem.image : `/${elem.image}`);

                    return (
                        <div key={elem.id} className="lot_result">
                            <img src={imageUrl} alt={elem.location} />
                            <div style={{ padding: '15px' }}>
                                <p><strong>Price:</strong> ${elem.price?.toLocaleString()}</p>
                                <p><strong>Area:</strong> {elem.rooms}</p>
                                <p><strong>Location:</strong> {elem.location}</p>
                                <p style={{ fontSize: '18px', color: '#555' }}>Type: {elem.type}</p>
                                <div style={{ marginTop: '10px', fontStyle: 'italic', color: '#888' }}>
                                    Property: {elem.propertyType}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}