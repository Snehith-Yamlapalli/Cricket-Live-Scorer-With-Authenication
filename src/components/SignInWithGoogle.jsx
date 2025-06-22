import React from 'react'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth, db } from './firebase'
import { setDoc, doc } from 'firebase/firestore'
import googleImage from './google-signin-button.png';


const SignInWithGoogle = () => {
    function googlelogin() {
        const provider = new GoogleAuthProvider()
        signInWithPopup(auth, provider).then(async (result) => {
            console.log(result)
            if (result.user) {
                const user = result.user;

                await setDoc(doc(db, 'Users', user.uid), {
                    email: user.email,
                    firstname: user.displayName,
                    lastname: '',
                    photo: user.photoURL
                })
                window.location.href = '/Home'
            }
        })
    }
    return (
        <div>
            <p className='continue-p' style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>--Or continue with--</p>
            <div style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }} onClick={googlelogin}>
           <img src={googleImage} width="15%" alt="Sign in with Google" />
            </div>
        </div>
    )
}

export default SignInWithGoogle
