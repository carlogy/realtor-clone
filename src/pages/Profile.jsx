import { getAuth, signOut, updateProfile } from 'firebase/auth';
import { collection, doc, getDocs, query, updateDoc, where, orderBy } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import {FcHome} from "react-icons/fc"
import ListingItem from '../components/ListingItem';


export default function Profile() {
  const auth = getAuth()
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
    const {name, email} = formData;    
    const navigate = useNavigate();
    const [changeDetail, setChangeDetail] = useState(false)
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
    function onChange(e) {
      setFormData((prevState) => ({
        ...prevState, 
        [e.target.id]: e.target.value,
      }))
    }
    async function onSubmit(){
      try {
        if(auth.currentUser.displayName !== name){
          await updateProfile(auth.currentUser, {
            displayName: name,
          });

          const docRef = doc(db, "users", auth.currentUser.uid)
          await updateDoc(docRef, {
            name,
          });

        }
        toast.success('Profile successfully updated!');
      } catch (error) {
        toast.error("Unable to update the profile information.")
      }
  }

    function onLogOut() {
     auth.signOut();
     navigate("/")
    }
    useEffect(() => {
      async function fetchUserListings() {
        const listingRef = collection(db, "listings");
        const q = query(listingRef, where("userRef", "==", auth.currentUser.uid)
        , orderBy("timestamp", "desc"));
        const querySnap = await getDocs(q);
        let listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listings)
        setLoading(false)
      }
      fetchUserListings();
    }, [auth.currentUser.uid])
  return (
    <>
    <section className='max-w-6xl mx-auto flex justify bg-center items-center flex-col'>
      <h1 className='text-3xl text-center mt-6 font-bold'>My Profile</h1>
      <div className='w-full md:w-[50%] mt-6 px-3'>
        <form>
          <input type='text' id='name' value={name} disabled={!changeDetail}
          onChange={onChange}
          className={`w-full px-4 py-2 text-xl text-gray-700 bg-gray-300 border border-gray-300 rounded transition ease-in-out mb-6 ${changeDetail && "bg-white focus:bg-white"}`}
          />
          <input type='email' id='email' value={email} disabled={!changeDetail}
          className="w-full px-4 py-2 text-xl text-gray-700 bg-gray-300 border border-gray-300 rounded transition ease-in-out mb-6" />
          <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg'>
            <p className='flex items-center mb-6'>Do you want to edit your name? 
              <span onClick={() => {
                changeDetail && onSubmit()
                setChangeDetail((prevState) => !prevState)
              }} 
              className='text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer'>
              {changeDetail ? "Apply change" : "Edit"}
              </span></p>
              <p onClick={onLogOut} className='text-blue-600 hover:text-blue-800 transition ease-in-out duration-200 cursor-pointer'>Sign Out</p>
          </div>          
        </form>

        <button type='submit' className='w-full bg-blue-600 text-white uppercase rounded px-7 py-3 text-sm font-medium transition ease-in-out shadow-md hover:bg-blue-700 hover:shadow-lg cursor-pointer duration-150 active:bg-blue-800'> 
        <Link to="/create-listing"
        className='flex justify-center items-center'>
        
        <FcHome className='mr-2 text-3xl bg-red-300 rounded-full p-1 border-2'/>
        Sell or rent your home</Link>
        </button>
      </div>
    </section>
    <div className='max-w-6xl px-3 mt-6 mx-auto'>
      {!loading && listings.length > 0 && (
        <>
        <h2 className='text-2xl text-center font-semibold'>My Listings</h2>
        <ul>
          {listings.map((listing) => (
           <ListingItem           
           key={listing.id} 
           id={listing.id} 
           listing={listing.data} />
         ))}
        </ul>
        </>
      )}
    </div>
    </>
  )
}
