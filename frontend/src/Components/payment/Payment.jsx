import React from 'react'
import { useNavigate } from 'react-router-dom';
import './Payment.css';
const Payment = () => {
    const navigate=useNavigate();
    const handleOrderConfirm = () => {
        alert("Your Order is placed successfully!");
        localStorage.removeItem("cart");
        const from = '/'; // Default value for 'from'
        navigate(from, { replace: true });
    }
  return (
       <div className='loginsignup'>
            <div className='loginsignup-container'>
                                <h2>Credit card</h2>
                          
                          
                            <div className='inputbox'>
                              <input type='text' name='name' id='name' className='form-control' required/>
                              <span>Cardholder Name</span>
                            </div>
                            <div className='inputbox'>
                              <input type='text' name='number' id='number' min='1' max='999' className='form-control' required/>
                              <span>Card Number</span>
                              <i className='fa fa-eye'></i>
                            </div>
                            <div className='d-flex flex-row'>
                            <div className='inputbox'>
                              <input type='text' name='name' id='name' className='form-control' required/>
                              <span>Expiration Date</span>
                            </div>
                            <div className='inputbox'>
                              <input type='text' name='name' id='name' className='form-control' required/>
                              <span>CVV</span>
                            </div>
                            </div>
                            <div className='px-5 pay'>
                              <button className='btn btn-success btn-block rounded-5' onClick={handleOrderConfirm}>Order</button>
                            </div>
                          </div>

                        </div>
  )
}

export default Payment