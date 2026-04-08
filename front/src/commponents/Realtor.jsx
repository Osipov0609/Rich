import { useEffect, useState } from 'react'
import './css/Realtor.css'

export default function Realtor() {
    const [real, setReal] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        const fetchData = fetch('http://localhost:5000/realtor')
            .then(response => response.json());

        const timer = new Promise(resolve => setTimeout(resolve, 2000));

        Promise.all([fetchData, timer])
            .then(([data]) => {
                setReal(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching Realtor', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <p style={{ textAlign: 'center', fontSize: '45px', color: '#006837', marginTop: '250px' }}>
                My Team is Very Strong
            </p>
        );
    }

    return (
        <div className='realtor'>
            <h2 style={{ textAlign: 'center' }}>My Team</h2>
            <div className="box">
                {real.map((elem) => (
                    <div key={elem.id} className="real_result">

                        <img src={elem.image} alt={elem.name} />
                        <div style={{ padding: '10px' }}>
                            <p><strong>Name:</strong> {elem.name}</p>
                            <p><strong>Position:</strong> {elem.position}</p>
                            <p><strong>Specialization:</strong> {elem.specialization}</p>
                            <p><strong>Experience:</strong> {elem.experience}</p>
                            <p><strong>Phone:</strong> {elem.phone}</p>
                            <p><strong>Email:</strong> {elem.email}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}