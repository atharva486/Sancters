"use client";
import { useEffect,useState } from 'react'
function Footer() {
    const [year,setYear]=useState('');
    useEffect(()=>{setYear(new Date().getFullYear())},[])
  return (
    <div className="bg-gray-100 text-center text-sm py-4">
          © {year} Sancters — Productivity with Trust
    </div>
  )
}

export default Footer
