import { useState } from 'react';
import axios from 'axios';
import './css/Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    message: ''
  });

  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Boolean state բեռնման համար

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Սահմանում ենք true, երբ սկսում է ուղարկվել
    setStatus('Ուղարկվում է...');

    try {
      const fullText = `
📩 Նոր հայտ կայքից:
👤 Անուն: ${formData.name} ${formData.surname}
📧 Email: ${formData.email}
📝 Հաղորդագրություն: ${formData.message}
      `;

      // Փոխիր այս URL-ը քո իրական backend-ի հասցեով, երբ տեղադրես սերվերի վրա
      // Փոխարինիր սա
      const response = await axios.post('https://rich-2-7dn1.onrender.com/li', {
        message: fullText
      });;

      if (response.status === 200) {
        setStatus('Հաջողությամբ ուղարկվեց։');
        setFormData({ name: '', surname: '', email: '', message: '' });
      }
    } catch (error) {
      setStatus('Սխալ սերվերի հետ կապի ժամանակ։');
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false); // Անկախ արդյունքից, վերջում դարձնում ենք false
    }
  };

  return (
    <div className='contact'>
      <h4>Contact us to stay connected with our team...</h4>
      <div className="box">
        <img src={process.env.PUBLIC_URL + '/images/logo/logo2.jpg'} alt="Logo2" />

        <form className="contact_info" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="surname"
            placeholder="SurName"
            value={formData.surname}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* Եթե ֆայլի բեռնում դեռ չես իրականացրել backend-ում, այս դաշտը պարզապես դիզայնի համար է */}
          <input type="file" className='fileCv' />

          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>

          <button
            type="submit"
            className="sendBtn"
            disabled={isLoading} // Կոճակը դառնում է անակտիվ ուղարկելիս
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>

          {status && <p className="status-msg">{status}</p>}
        </form>
      </div>
    </div>
  );
}