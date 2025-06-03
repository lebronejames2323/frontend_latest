import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { imageUrl2 } from "../api/configuration";
import Slider from "react-slick";
import { getCategories } from "../api/product-fetch";

function Category() {
    const [categories, setCategories] = useState([]);
    
    const refreshCategories = () => {
    getCategories().then((res) => {
    setCategories(res?.data);
    });
    };
    
    useEffect(refreshCategories, []);

    const navigate = useNavigate();
    const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName}`);
    };

    const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    };

    return (
        <div id='category' className='w-full bg-gray-100 lg:px-20 px-10 pt-[130px] pb-[80px] flex lg:flex-row flex-col justify-center items-center gap-20'>
            
            <div className='lg:w-[15%] w-full flex flex-col justify-center lg:items-start items-center gap-[20px]'>
            <h1 className='text-black border-3 rounded-lg text-xl font-bold text-center'>Category Items<br/></h1>
            <h1 className='text-black font-semibold text-[42px] leading-[50px] text-center lg:text-start'>Browse Category</h1>
            <button className='bg-themegreen text-white px-8 py-3 rounded-lg font-semibold mt-[30px]'>Good Deals</button>
            </div>
            
            <div className='lg:w-[70%] grid lg:grid-cols-1 justify-center items-center'>
                <Slider {...settings}>
                {categories && categories.length > 0 && categories.map((category) => (
                <div key={category.id} className='flex flex-col justify-items-center items-center px-1'>
                <div onClick={() => handleCategoryClick(category.name)} className='flex justify-center items-center max-w-[200px] max-h-[200px]'>
                    <img 
                    src={`${imageUrl2}/${category.id}.${category.extension}`} alt="" 
                    className='rounded-xl cursor-pointer w-[160px] h-[160px] p-3 object-cover bg-white shadow-md' 
                    />
                </div>
                <h1 onClick={() => handleCategoryClick(category.name)} className='text-lg font-semibold hover:text-themegreen cursor-pointer text-center mt-2'>{category.name}</h1>
                </div>
                ))}
                </Slider>
            </div>

            <div className='lg:hidden flex flex-col items-center w-full gap-5'>
                <div className='grid grid-cols-1 gap-4 w-full px-4'>
                    {categories.map((category) => (
                        <div key={category.id} className='flex flex-col items-center'>
                            <div onClick={() => handleCategoryClick(category.name)} className='flex justify-center items-center w-[140px] h-[140px]'>
                                <img 
                                    src={`${imageUrl2}/${category.id}.${category.extension}`} alt="" 
                                    className='rounded-xl cursor-pointer w-full h-full object-cover bg-white shadow-md' 
                                />
                            </div>
                            <h1 onClick={() => handleCategoryClick(category.name)} className='text-lg font-semibold hover:text-themegreen cursor-pointer text-center mt-2'>{category.name}</h1>
                        </div>
                    ))}
                </div>
            </div>
            
        </div>
    )
}

export default Category