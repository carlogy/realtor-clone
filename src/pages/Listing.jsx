import { doc, getDoc, url } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import Spinner from '../components/Spinner';
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore, {EffectFade, Autoplay, Navigation, Pagination} from "swiper"
import "swiper/css/bundle"
import {FaShare, FaMapMarkerAlt, FaBed, FaBath, FaParking, FaChair} from 'react-icons/fa'
import {getAuth} from "firebase/auth"
import Contact from '../components/Contact';

export default function Listing() {
    const auth = getAuth();
    const params = useParams();
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [shareLinkCopied, setShareLinkCopied] = useState(false);
    const [contactOwner, setContactOwner] = useState(false)
    SwiperCore.use([Autoplay, Navigation, Pagination]);
    useEffect(() => {
        async function fetchListing(){
        const docRef = doc(db, "listings", params.listingId)
        const docSnap = await getDoc(docRef)
        if(docSnap.exists()) {
            setListing(docSnap.data())
            setLoading(false)
            console.log(listing);
        }

        }
        fetchListing();

    }, [params.listingId]);
    if(loading){
        return <Spinner />
    }
  return (
    <main>
        <Swiper slidesPerView={1} 
        navigation 
        pagination={{type:"progressbar"}} 
        effect='fade'
        modules={[EffectFade]} 
        autoplay={{delay: 3000}}>

        {listing.imgUrls.map((url, index) => ( 
            <SwiperSlide key={index}>
                <div className='relative w-full overflow-hidden h-[300px]' 
                style={{
                    background: `url(${listing.imgUrls[index]}) center no-repeat`, backgroundSize: "cover" }}>

                </div>

            </SwiperSlide>

        ))}
        </Swiper>
        <div className='fixed top-[8%] right-[1%] z-10
         bg-white cursor-pointer border-2 border-gray-400 
         rounded-full w-12 h-12 flex justify-center items-center'
        onClick={() => {
            navigator.clipboard.writeText(window.location.href)
            setShareLinkCopied(true)
            setTimeout(() => {
               setShareLinkCopied(false)
            }, 2000);
        } }
        >
            <FaShare className='text-lg text-slate-500' />
        </div>
        {shareLinkCopied && (
            <p className='fixed top-[13.2%] right-[4%] font-semi border-2 border-gray-400 rounded-md bg-white z-10 p-2' >Link copied</p>
        
        )}   

        <div className=' m-4 flex flex-col md:flex-row mx-w-6xl lg:mx-auto p-4 rounded-lg shadow-lg bg-white lg:space-x-5'>
        <div className='w-full   '>
            <p className='text-2xl font-bold mb-3 text-blue-900'>
                {listing.name} - ${listing.offer ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                 : listing.regularPrice
                 .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        {listing.type === "rent" ? " / Month" : ""}
            </p>
            <p className=' flex items-center mt-6 mb-3 font-semibold '> <FaMapMarkerAlt className=' text-green-700 mr-1'/> {listing.address} </p>
           <div className='flex justify-start items-centers space-x-4 w-[75%]'>
            <p className='bg-red-800  w-full max-w-[200px] rounded-md text-white text-center font-semibold shadow-md'>{listing.type === "rent" ? "Rent" : "Sale"}</p> 
            {listing.offer && (
                <p className='bg-green-800  w-full max-w-[200px] rounded-md text-white text-center font-semibold shadow-md' >${+listing.regularPrice - +listing.discountedPrice} discount </p>
            )} 
           </div>
           <p className=' mt-3 mb-3 '> <span className='font-semibold'>Description - </span>
           {listing.description} </p>
           <ul className='flex items-center space-x-2 lg:space-x-10 text-sm font-semibold'>
            <li className='flex items-center whitespace-nowrap'>
                <FaBed className="text-lg mr-1"/>
                {+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
            </li>
            <li className='flex items-center whitespace-nowrap'>
                <FaBath className="text-lg mr-1"/>
                {+listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
            </li>
            <li className='flex items-center whitespace-nowrap'>
                <FaParking className="text-lg mr-1"/>
                {+listing.parking > 1 ? `${listing.parking} Parking Spot` : "No Parking"}
            </li>
            <li className='flex items-center whitespace-nowrap'>
                <FaChair className="text-lg mr-1"/>
                {+listing.furnished > 1 ? `${listing.furnished} Furnished` : "Not Furnished"}
            </li>
           </ul>
           {listing.userRef !== auth.currentUser?.uid && !contactOwner && (
            <div className='mt-6'>
            <button onClick={() => setContactOwner(true)}
            className='px-7 py-3 bg-blue-600 text-white font-medium w-full text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg cursor-pointer text-center transition duration-150 ease-in-out'  >Contact Owner </button>
            </div>
           )}
           {contactOwner && (
            <Contact userRef={listing.userRef}
            listing={listing} />
           )}
           
        </div>
        <div className='w-full   bg-blue-300 z-10 overflow-x-hidden'></div>
        </div> 
        
           
        
        </main>
  )
}
