import { createUserWithEmailAndPassword } from "firebase/auth"
import { useState } from "react"
import { auth, db } from './firebase'
import { setDoc, doc } from "firebase/firestore"


const Register = () => {

    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [fname, setfname] = useState('')
    const [lname, setlname] = useState('')

    const handleRegister = async (e) =>{
        e.preventDefault()
        try{
            await createUserWithEmailAndPassword(auth,email,password);
            const user = auth.currentUser
            if(user){
                await setDoc(doc(db,'NewUsers',user.uid),{
                    UserEmail:email,
                    UserFirstName:fname,
                    UserLastName:lname,
                })
            window.location.href='/Profile'
            }
        }catch (error) {
            alert(error.message)
    }}


    return (
        <form onSubmit={handleRegister}>
            <div className='shadow-lg p-4 mb-3 rounded col-md-4 mx-auto' style={{ backgroundColor: 'rgb(182, 172, 171)', marginTop: '120px' }}>
                <h1>Sign Up</h1>
                <div className='mb-3'>
                    <label>First Name</label>
                    <input type="text" className="form-control" placeholder="First Name" value={fname} onChange={(e) => { setfname(e.target.value) }} />
                </div>
                <div className='mb-3'>
                    <label>Last Name</label>
                    <input type="text" className="form-control" placeholder="Last Name" value={lname} onChange={(e) => { setlname(e.target.value) }} />
                </div>
                <div className='mb-3'>
                    <label>Email Address</label>
                    <input type="email" className="form-control" placeholder="Enter Email" value={email} onChange={(e) => { setemail(e.target.value) }} />
                </div>
                <div className='mb-3'>
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Enter Password" value={password} onChange={(e) => { setpassword(e.target.value) }} />
                </div>
                <div className='d-grid'>
                    <button type='submit' className='btn btn-primary'>Submit</button>
                </div>
            </div>
        </form>
    )
}
export default Register
