import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { imageUrl } from "../api/configuration";
import Slider from "react-slick";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { getCategories } from "../api/product";
import { useCookies } from "react-cookie";

function Category() {
    const [categories, setCategories] = useState([]);
    const [cookies] = useCookies();
    
    const refreshCategories = () => {
    getCategories(cookies.token).then((res) => {
    setCategories(res?.data);
    });
    };
    
    useEffect(refreshCategories, []);

    const navigate = useNavigate();
    const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName.toLowerCase()}`);
    };

    const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1
    };

    useEffect(() => {
    AOS.init({
    offset: 100,
    duration: 500,
    easing: 'ease-in-out',
    });

    AOS.refresh();

    }, [])

    return (
        <div id='category' className='w-full bg-gray-100 lg:px-20 px-5 pt-[130px] pb-[80px] flex lg:flex-row flex-col justify-center items-center gap-20'>
            
            <div className='lg:w-[15%] w-full flex flex-col justify-center lg:items-start items-center gap-[20px]'>
            <h1 className='text-black border-3 rounded-lg text-xl font-bold text-center'>Category Items<br/></h1>
            <h1 className='text-black font-semibold text-[42px] leading-[50px] text-center lg:text-start'>Browse Category</h1>
            <button className='bg-themegreen hover:bg-themeyellow text-white hover:text-black px-8 py-3 rounded-lg font-semibold mt-[50px]'>50% Discount</button>
            </div>
            
            <div className='lg:w-[70%] grid lg:grid-cols-1'>
                <Slider {...settings}>
                {categories && categories.length > 0 && categories.map((category) => (
                <div onClick={() => handleCategoryClick(category.name)} key={category.id} className='flex flex-col justify-center items-center p-1'>
                    <img 
                    src={`${imageUrl}/${category.id}.${category.extension}`} alt="" 
                    className='rounded-xl cursor-pointer w-[200px] h-[200px] p-3 object-cover bg-white shadow-md' 
                    />
                <h1 className='text-black text-xl font-semibold hover:text-themegreen cursor-pointer text-center mr-5 mt-2'>{category.name}</h1>
                </div>
                ))}
                </Slider>
            </div>
        </div>
    )
}

export default Category
