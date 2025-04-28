import React from 'react'
import { NavLink } from 'react-router-dom'
import { CiCirclePlus } from "react-icons/ci";
import { LiaCalendarCheckSolid } from "react-icons/lia";
import { PiPackage } from "react-icons/pi";

const Sidebar = () => {
  return (
    <div className='w-[18%] min-h-screen border-r-2'>
        <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>

          <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 rounded-l' to = "/add-category"
          style={({ isActive }) => ({
            backgroundColor: isActive ? '#90EE90' : 'transparent',
            borderColor: isActive ? '#32CD32' : 'transparent',
          })}
          >
              <CiCirclePlus className='w-7 h-7'/>
              <p className='hidden md:block'>Add Categories</p>

            </NavLink>

            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 rounded-l' to = "/add"
            style={({ isActive }) => ({
              backgroundColor: isActive ? '#90EE90' : 'transparent',
              borderColor: isActive ? '#32CD32' : 'transparent',
            })}
            >
              <CiCirclePlus className='w-7 h-7'/>
              <p className='hidden md:block'>Add Items</p>

            </NavLink>
            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 rounded-l' to = "/list-category"
            style={({ isActive }) => ({
              backgroundColor: isActive ? '#90EE90' : 'transparent',
              borderColor: isActive ? '#32CD32' : 'transparent',
            })}
            >
              <LiaCalendarCheckSolid className='w-7 h-7'/>
              <p className='hidden md:block'>Category List</p>
            </NavLink>
            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 rounded-l' to = "/list"
            style={({ isActive }) => ({
              backgroundColor: isActive ? '#90EE90' : 'transparent',
              borderColor: isActive ? '#32CD32' : 'transparent',
            })}
            >
              <LiaCalendarCheckSolid className='w-7 h-7'/>
              <p className='hidden md:block'>Item List</p>

            </NavLink>
            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 rounded-l' to = "/order"
            style={({ isActive }) => ({
              backgroundColor: isActive ? '#90EE90' : 'transparent',
              borderColor: isActive ? '#32CD32' : 'transparent',
            })}
            >
              <PiPackage className='w-7 h-7'/>
              <p className='hidden md:block'>Orders</p>

            </NavLink>

        </div>
    </div>
  )
}

export default Sidebar