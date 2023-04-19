import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../firebase';
import { toast } from 'react-toastify';

export default function Contact({userRef, listing}) {
    const [contactOwner, setOwner] = useState(null);
    const [message, setMessage] =useState(null);
    useEffect(()=> {
        async function getOwner(){
        const docRef = doc(db, "users", userRef);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
            setOwner(docSnap.data())
        }else {
            toast.error("Could not get owner data.")
        }
        }
        getOwner();
    }, [userRef]);
    function onChange(e){
        setMessage(e.target.value)
    }
  return   <> {contactOwner !== null && (
    <div className='flex flex-col w-full mt-6' >
        <p>Contact {contactOwner.name} for the {listing.name.toLowerCase()} listings.</p>
        <div>
        <textarea name='message'
        id='message'
        rows={2}
        value={message} 
        onChange={onchange} 
        className='w-full px-4 py-2 text-xl border-gray-300 rounded transition duration-150 ease-in-out
        focus:text-gray-700 border-slate-700'>
        </textarea>
    </div>
    <a href={`mailto:${contactOwner.email}?Subject=${listing.name}$body=${message}`}>
        <button type='button' className=' mt-2 mb-6 px-7 py-3 bg-blue-600 rounded text-sm uppercase text-white
        shadow-md hover:bg-blue-800 cursor-pointer w-full hover:shadow-lg focus:shadow-lg transition ease-in-out text-centers'>Send Message</button>
    </a>
   
    </div>
    

        
    
  )}</>;
  
}
