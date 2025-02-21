import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import '../App.css'; 

export default function InvestorForm() {
    const [formData, setFormData] = useState({
        profilePhoto: null,
        phone: '',
        investmentAmount: '',
        investmentType: '',
        industry: '',
        investmentStage: '',
        duration: '',
        verificationDocument: null
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        if (e.target.name === "profilePhoto" || e.target.name === "verificationDocument") {
            setFormData({ ...formData, [e.target.name]: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation logic
        if (!formData.profilePhoto || !formData.verificationDocument) {
            setError("Profile photo and verification document are required.");
            return;
        }

        if (parseInt(formData.investmentAmount) < 10000) {
            setError("Minimum investment amount should be $10,000.");
            return;
        }

        setError("");
        console.log("Investor Data Submitted:", formData);
        // Implement form submission logic
    };

    return (
        <div className="investor-form-container">
            <h2 className="investor-form-title">Investor Investment Form</h2>
            {error && <p className="error-message">{error}</p>}
            <form className='investor-form' onSubmit={handleSubmit}>
                <input type="file" name="profilePhoto" accept="image/*" className="investor-input" onChange={handleChange} required />
                <input type="file" name="verificationDocument" accept="application/pdf,image/*" className="investor-input" onChange={handleChange} required />
                <input type="text" name="phone" placeholder="Phone Number" className="investor-input" onChange={handleChange} required />
                <input type="number" name="investmentAmount" placeholder="Investment Amount ($)" className="investor-input" onChange={handleChange} required />
                
                <select name="investmentType" className="investor-input investor-dropdown" onChange={handleChange} required>
                    <option value="" disabled selected>Select Investment Type</option>
                    <option value="equity">Equity</option>
                    <option value="debt">Debt</option>
                    <option value="convertible">Convertible Note</option>
                </select>
                
                <input type="text" name="industry" placeholder="Preferred Industry" className="investor-input" onChange={handleChange} required />
                <input type="text" name="investmentStage" placeholder="Investment Stage" className="investor-input" onChange={handleChange} required />
                <input type="text" name="duration" placeholder="Investment Duration (Years/Months)" className="investor-input" onChange={handleChange} required />
                
                <button type="submit" className="investor-submit-btn">Submit Investment</button>
            </form>
        </div>
    );
}
