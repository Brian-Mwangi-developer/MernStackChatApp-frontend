import React, { useRef, useState } from 'react'
import {useSignUpUserMutation} from '../services/appApi';
import dog from "../assets/dogface.jpg"
import { Link, useNavigate } from 'react-router-dom'
import { GrAddCircle } from "react-icons/gr";


export const Signup = () => {
  const fileInputRef = useRef(null);
  const [name,setName] =useState("Brian");
  const [email,setEmail] =useState("example@example.com");
  const [password,setPassword] =useState("000000");
  const [signupUser,{isLoading, error}] =useSignUpUserMutation();
  const navigate = useNavigate();

  //image upload state
  const [image,setImage] =useState(null);
  const [uploadingimg,setUploadingimg] =useState(false);
  const [imagePreview,setImagePreview] =useState(null);

  function validateImg(e){
    const file =e.target.files[0];
    if(file.size >=1048576){
      return alert("Max file size is 1mb");
    }else{
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  const handleIconClick = () => {
    fileInputRef.current.click();
  }

  async function uploadImage() {	
    const data = new FormData();	
    data.append('file', image);	
    data.append('upload_preset', 'um1ovdoq');	
    try {	
      setUploadingimg(true);	
      let res = await fetch('https://api.cloudinary.com/v1_1/ddjyjlqcy/image/upload', { // Add 'https://' before 'api.cloudinary.com'	
        method: 'post',	
        body: data	
      });	
      const urlData = await res.json();	
      setUploadingimg(false);	
      return urlData.url;	
    } catch (error) {	
      setUploadingimg(false);	
      console.log(error);	
    }	
  }	
  async function handleSignup(e) {	
    e.preventDefault();	
    if (!image) return alert("Please upload your profile picture");	
    const url = await uploadImage(image);	
    console.log(url);
    //signup User
    signupUser({name,email,password, picture:url}).then(({data})=>{
      if (data){
        console.log(data);
      }
    })
    navigate('/chat');
  }

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl  mb-5 font-bold leading-9 tracking-tight text-gray-900">Create an account</h2>
        <div className=" relative">
          <img className="mx-auto rounded-full h-36 w-36 object-cover" src={imagePreview ||dog} alt="Your Company" />
          <GrAddCircle color="green" size={30} className='cursor-pointer absolute right-0' onClick={handleIconClick} />

          <input type='file' id='image_upload' hidden accept='image/png,image/jpg,image/jpeg' ref={fileInputRef} onChange={validateImg} />
        </div>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action="#" method="POST" onSubmit={handleSignup}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Name</label>
            <div className="mt-2">
              <input id="name" name="name" type="text" autoComplete="text" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"value={name}  onChange={(e)=>setName(e.target.value)} />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
            <div className="mt-2">
              <input id="email" name="email" type="email" autoComplete="email" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={email} onChange={(e)=>setEmail(e.target.value)} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
              <div className="text-sm">
                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
              </div>
            </div>
            <div className="mt-2">
              <input id="password" name="password" type="password" autoComplete="current-password" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"value={password} onChange={(e)=>setPassword(e.target.value)} />
            </div>
          </div>

          <div>
            <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">{uploadingimg?"signing you up.......":"Sign Up"}</button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          <Link to={"/login"} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            Already have an Account?
          </Link>
        </p>
      </div>
    </div>
  )
}
