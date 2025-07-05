import React, { useState, useEffect } from "react";
import client1 from '../assets/client1.png'
import client2 from '../assets/client2.png'
import client3 from '../assets/client3.png'
import client4 from '../assets/client4.png'
import client5 from '../assets/client5.jpg'
import client6 from '../assets/client6.png'
import pay1 from '../assets/pay-1.jpg'
import pay2 from '../assets/pay-2.jpg'
import pay3 from '../assets/pay-3.jpg'
import pay4 from '../assets/pay-4.jpg'
import { Link } from 'react-scroll';
import { FaArrowUp, FaRegCommentDots } from 'react-icons/fa';
import { index } from '../api/auth';
import { useCookies } from 'react-cookie';
import ChatModal from '../components/ChatModal';
import AdminChatModal from '../components/AdminChatModal';
import TermsOfService from '../components/TermsOfService';
import CancellationPolicyModal from '../components/CancellationPolicyModal';
import PrivacyPolicyModal from '../components/PrivacyPolicyModal';
import OrderAndPaymentModal from '../components/OrderAndPaymentModal';
import OurCompanyModal from '../components/OurCompanyModal';
import DeliveryModal from '../components/DeliveryModal';
import FAQsModal from '../components/FAQsModal';


const Footer = () => {
    const [cookies] = useCookies();
    const [user, setUser] = useState(null);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showPolicyModal, setShowPolicyModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [showCompanyModal, setShowCompanyModal] = useState(false);
    const [showDeliveryModal, setShowDeliveryModal] = useState(false);
    const [showFAQsModal, setShowFAQsModal] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isAdminChatOpen, setIsAdminChatOpen] = useState(false);

    const refreshUsers = () => {
        const token = cookies.token
            if (!token || token === 'undefined' || token.trim() === '') {
                return;
            }
            index(cookies.token).then((res) => {
            setUser(res?.data || null);
            });
        };
    
    useEffect(refreshUsers, []);

    return (
        <div id='contact' className='w-full flex flex-col justify-center items-center'>

            <div className='w-full bg-themegreen lg:px-20 px-10 py-8 grid lg:grid-cols-6 grid-cols-2 justify-center items-center gap-20'>
            <a href="https://www.samsung.com/ph/" target="_blank">
                <img src={client1} alt="" className='w-[130px] opacity-70 cursor-pointer hover:opacity-100'/>
                </a>
                <a href="https://www.acer.com/us-en/" target="_blank">
                <img src={client2} alt="" className='w-[130px] opacity-70 cursor-pointer hover:opacity-100'/>
                </a>
                <a href="https://www.lenovo.com/us/en/" target="_blank">
                <img src={client3} alt="" className='w-[130px] opacity-70 cursor-pointer hover:opacity-100'/>
                </a>
                <a href="https://www.sony.com/en/" target="_blank">
                <img src={client4} alt="" className='w-[130px] opacity-70 cursor-pointer hover:opacity-100'/>
                </a>
                <a href="https://www.asus.com/us/" target="_blank">
                <img src={client5} alt="" className='w-[130px] opacity-70 cursor-pointer hover:opacity-100'/>
                </a>
                <a href="https://www.logitech.com/en-us" target="_blank">
                <img src={client6} alt="" className='w-[130px] opacity-70 cursor-pointer hover:opacity-100'/>
                </a>
            </div>


            <div className='w-full lg:px-20 px-5 pt-[32px] bg-gray-100 grid lg:grid-cols-[auto,auto,auto,auto,auto] grid-cols-1 justify-between items-start lg:gap-3 gap-10'>
                <div className='flex flex-col justify-center item-start gap-10 grow'>
                    <div className='flex flex-col justify-center items-start gap-4'>
                        <h1 className='text-4xl font-bold text-themegreen underline italic'>CyberDrive Shop</h1>
                        <p className='text-gray-500 text-justify'>Your go-to store for top tech gear and PC components. <br/>Build, upgrade, and explore with ease! With top-tier products, <br/>competitive prices, and exceptional customer support.</p>
                    </div>
                </div>

                <div>
                    <h1 className='text-black text-xl font-semibold capitalize mb-2'>Useful Links</h1>
                    <ul className='flex flex-col justify-center items-start gap-2'>
                        <li onClick={() => setShowTermsModal(true)} className='text-gray-500 cursor-pointer hover:text-black'>Terms and Service</li>
                        <li onClick={() => setShowPolicyModal(true)} className='text-gray-500 cursor-pointer hover:text-black'>Cancellation Policy</li>
                        <li onClick={() => setShowPrivacyModal(true)} className='text-gray-500 cursor-pointer hover:text-black'>Privacy Policy</li>
                        <li onClick={() => setShowOrderModal(true)} className='text-gray-500 cursor-pointer hover:text-black'>Order and Payment</li>
                    </ul>
                </div>
                <div>
                    <h1 className='text-black text-xl font-semibold capitalize mb-2'>Useful Links</h1>
                    <ul className='flex flex-col justify-center items-start gap-2'>
                        <li onClick={() => setShowCompanyModal(true)} className='text-gray-500 cursor-pointer hover:text-black'>Our Company</li>
                        <li onClick={() => setShowDeliveryModal(true)} className='text-gray-500 cursor-pointer hover:text-black'>Delivery</li>
                        <li onClick={() => setShowFAQsModal(true)} className='text-gray-500 cursor-pointer hover:text-black'>FAQs</li>
                    </ul>
                </div>
            </div>


            <div className='w-full lg:px-20 px-5 py-[30px] bg-gray-100'>
                <hr className='border-t border-gray-300 py-3'/>
                <div className='w-full flex lg:flex-row flex-col justify-between items-center lg:gap-4 gap-10'>
                    <div className='lg:w-[20%] w-full flex justify-center items-center gap-4'>
                    <img src={pay1} alt="" className='w-[50px] rounded-lg'/>
                    <img src={pay2} alt="" className='w-[50px] rounded-lg'/>
                    <img src={pay3} alt="" className='w-[50px] rounded-lg'/>
                    <img src={pay4} alt="" className='w-[50px] rounded-lg'/>
                    </div>

                    <div className='lg:w-[20%] w-full'>
                    <p className='text-gray-500 lg:text-end text-center'>2025 Powered by MFI Polytechnic</p>
                    </div>
                </div>
            </div>

            {!user ? (
                <div className="text-sm text-gray-500"></div>
            ) : (
            <div
            onClick={() => {
                if (user?.id === 1) {
                setIsAdminChatOpen(true);
                } else {
                setIsChatOpen(true);
                }
            }}
            className='bg-themegreen text-white p-3 rounded-full hover:bg-themeyellow hover:text-black cursor-pointer fixed right-6 bottom-[90px]'
            >
            <FaRegCommentDots className='w-[30px] h-[30px]' />
            </div>
            )}


            <Link to="hero" spy={true} offset={-100} smooth={true}>
            <div
                id='icon-box'
                className='bg-themegreen text-white p-3 rounded-full hover:bg-themeyellow hover:text-black cursor-pointer fixed right-6 bottom-6'
            >
                <FaArrowUp className='w-[30px] h-[30px]' />
            </div>
            </Link>

            {isChatOpen && <ChatModal onClose={() => setIsChatOpen(false)} token={cookies.token} />}
            {isAdminChatOpen && <AdminChatModal onClose={() => setIsAdminChatOpen(false)} token={cookies.token} />}
            <TermsOfService isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
            <CancellationPolicyModal isOpen={showPolicyModal} onClose={() => setShowPolicyModal(false)} />
            <PrivacyPolicyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
            <OrderAndPaymentModal isOpen={showOrderModal} onClose={() => setShowOrderModal(false)} />
            <OurCompanyModal isOpen={showCompanyModal} onClose={() => setShowCompanyModal(false)} />
            <DeliveryModal isOpen={showDeliveryModal} onClose={() => setShowDeliveryModal(false)} />
            <FAQsModal isOpen={showFAQsModal} onClose={() => setShowFAQsModal(false)} />
        </div>
    )
}

export default Footer