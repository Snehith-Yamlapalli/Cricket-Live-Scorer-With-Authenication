import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import {auth} from './firebase'
import SignInWithGoogle from './SignInWithGoogle'

const Login = () => {
    const [Email,setEmail] = useState()
    const [passowrd,setpassword] = useState()

    const handlesubmit = async (e) => {
        e.preventDefault()
        try{
            await signInWithEmailAndPassword(auth,Email,passowrd);
            alert('User logged in successfully')
            window.location.href = './Home'
        } catch(error){
            alert(error)
        }
    }
    function navreg()
    {
        window.location.href = './Register'
    }

  return (
    <form onSubmit={handlesubmit}>
      <h1 className='text-center mb-4'>Login</h1>
      <div className='row justify-content-center' style={{backgroundColor:'rgb(208, 214, 206)'}}>
        <div className='col-md-6 bg-red p-3 mb-5 d-flex flex-column gap-3 align-items-center'>
        <input type="email" placeholder='Email' className='form-control' onChange={(e)=>{setEmail(e.target.value)}}/>
        <input type="password" placeholder='Password' className='form-control' onChange={(e)=>{setpassword(e.target.value)}}/>
        <input type="submit" className='btn btn-primary' value='Login In' style={{width:'120px'}}/>
        <input type="button" className='btn btn-primary' value='Register' onClick={navreg}/>
        </div>
        <SignInWithGoogle/>
      </div>
    </form>
  )
}

export default Login
