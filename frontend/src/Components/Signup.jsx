import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import axios from 'axios'
import { baseURL } from '../configs'

const Signup = () => {
        const [msg, setMsg] = useState({
            type:'',
            msg:''
        });
        const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            username: '',
            password: ''
        },
        onSubmit: async (values)=>{
            console.log('onsubmit')
            console.log({values});
            let url = baseURL+'user/signup';
            try {
                let data= await axios.post(url,{...values});
                data=data.data;
                console.log(data);
                setMsg({
                    type:'success',
                    msg:data.message
                })
                localStorage.setItem('paytmtoken',data.token);
                navigate('/dashboard');
            } catch (error) {
                console.log('error ');
                console.log(error.response.data.message)
                setMsg({
                    type:'error',
                    msg:error.response.data.message

                });
                console.log('the state is ');
                console.log(msg);

            }
        }
    })

    
    return (
        <div className='w-[100vw] h-[100vh]  bg-white fixed top-0 left-0  '>
            <div className='w-full h-full absolute bg-black/40 z-10'></div>
            <form onSubmit={formik.handleSubmit} className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2   p-4 rounded-md z-20 bg-white w-4/5 sm:w-fit'>
                <div>
                    <h1 className='text-3xl font-bold text-center m-2'>Signup</h1>
                    <p className='text-center text-slate-500 m-2 w-4/5 mx-auto text-xl'>Enter your information to create an account</p>
                    {msg?.msg&& <p className={`${msg.type=='success'?'text-green-400':'text-red-400'} text-center`}>*{msg.msg}</p>}
                </div>
                <div>
                    <div className='flex flex-col'>
                        <label htmlFor='firstName' className='text-xl my-2 font-bold' >First Name</label>
                        <input type='text' className='border-2  border-slate-200 focus:border-black p-2 rounded-lg px-3' value={formik.firstName} onChange={formik.handleChange} name='firstName'  />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor='lastName' className='text-xl my-2 font-bold' >Last Name</label>
                        <input type='text' className='border-2  border-slate-200 focus:border-black p-2 rounded-lg px-3' value={formik.lastName} name='lastName' onChange={formik.handleChange}  />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor='username' className='text-xl my-2 font-bold' >Username</label>
                        <input type='text' className='border-2  border-slate-200 focus:border-black p-2 rounded-lg px-3' value={formik.username} name='username'  onChange={formik.handleChange} />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor='password' className='text-xl my-2 font-bold' >Password</label>
                        <input type='password' className='border-2  border-slate-200 focus:border-black p-2 rounded-lg px-3' value={formik.password} name='password' onChange={formik.handleChange}  />
                    </div>
                    <div>
                        <button type="submit" className="px-8 py-3 font-semibold rounded text-gray-100 bg-gray-800 block m-auto mt-8 mb-3 w-full">Signup</button>
                        <p className='text-black text-center font-semibold mb-4'>Alredy have an account? <Link className='underline underline-offset-2' to={'/signin'} >Login</Link></p>
                    </div>
                </div>

            </form>
        </div>
    )
}

export default Signup