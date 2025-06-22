import  { useEffect, useState } from 'react'
import { auth } from './firebase'
import Home from '../CricApp/Home'
const Profile = () => {
    const [userDetails, setUserdetails] = useState(null)

    const fetchuserdetails = async () => {
        auth.onAuthStateChanged(async (user) => {
            if (user) setUserdetails(user)
            else console.log("No user is logged in");
        })
    }

    useEffect(() => {
        fetchuserdetails()
    }, [])

    async function logout() {
        try {
            await auth.signOut()
            window.location.href = './'
        } catch (error) { alert(error) }
    }

    return (
        <div>
            {userDetails ? (
                <>
                    <div className='col-md-12 bg-warning d-flex p-3 mb-3 ' style={{ gap: '250px' }}>
                        <h2>Welcome </h2>
                        <div>
                            <p style={{position:'absolute',left:'20px',top:'50px'}}>Email : {userDetails.email} </p>
                        </div>
                        <h1>Cric App</h1>
                        <button className="btn btn-primary" onClick={logout} style={{marginLeft:'350px'}}>Logout </button>
                    </div>
                    <Home/>
                </>
            ) : (
                <p>Loading....</p>
            )
            }
        </div>
    )
}

export default Profile
