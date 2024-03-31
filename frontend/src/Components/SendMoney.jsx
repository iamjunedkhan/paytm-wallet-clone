import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { baseURL } from '../configs';

const SendMoney = ({ to }) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('userId');
    const navigate= useNavigate();

    const [amount, setAmount] = useState('')
    useEffect(() => {
        console.log(userId);
    }, [])

    const handleTransfer = async () => {

        try {
            let data = await axios.post(baseURL + 'account/transfer', {
                to: userId,
                amount: amount
            }, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('paytmtoken')
                }
            });

            console.log('insideHanleTransfer');
            console.log({ data });
            navigate(-1);
            
        } catch (error) {
            console.log('error in transfer');
            console.log(error);
        }
    }

    return (
        <div className='w-[100vw] h-[100vh]   fixed top-0 left-0 bg-black/40 z-10 '>
            <div className=' w-4/5 sm:w-1/4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white pb-8'>
                <h1 className='text-center text-3xl font-semibold m-4 sm:m-8' >Send Money</h1>
                <div className='flex gap-4 items-center text-xl mx-4 sm:mx-8'>
                    <span className='text-center align-middle text-gray-800 bg-green-500 rounded-full p-3 text-2xl w-12 h-12   font-semibold flex justify-center items-center'><span>JK</span></span>
                    <span>Juend Khan</span>
                </div>
                <div className='mx-4 sm:mx-10 mb-4'>
                    <p>Amount (in RS)</p>
                    <input type='text' className='border-2  border-slate-200 focus:border-black p-1 rounded-lg px-3 w-full my-1' placeholder='Enter Amount' value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                <div className='mx-4 sm:mx-10 mb-4'>
                    <button type="button" onClick={handleTransfer} className="px-8 py-3 font-semibold rounded text-gray-100 bg-green-500 block m-auto mt-8 mb-3 w-full">Initiate Transfer</button>
                </div>
            </div>
        </div>
    )
}

export default SendMoney