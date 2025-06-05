import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        setSubmitted(true);
      }
    } catch (err) {
      // handle error
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-10">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 bg-themegreen text-white px-4 py-2 rounded-lg hover:bg-themeyellow hover:text-black transition"
      >
        Back
      </button>
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg mt-10">
        <h2 className="text-2xl font-bold mb-6 text-themegreen">Contact Us</h2>
        {submitted ? (
          <div className="text-green-600 font-semibold text-center">Thank you for contacting us! We'll get back to you soon.</div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-themegreen"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
              className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-themegreen"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className="border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-themegreen"
            />
            <button
              type="submit"
              className="w-full text-base py-3 rounded-md text-white bg-themegreen hover:bg-themeyellow hover:text-black focus:outline-none focus:ring-2 focus:ring-themegreen"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact; 