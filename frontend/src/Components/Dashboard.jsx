import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { baseURL } from '../configs';
import Loading from './Loading';
import { useNavigate } from 'react-router-dom';
import { userState } from '../../store/User';
import { useRecoilState } from 'recoil';

let interval = null;
const Dashboard = () => {
    const [myUserState,setMyUserState]  = useRecoilState(userState)
    const navigate = useNavigate();
    const [user, setUser] = useState({
        balance: '',
    });

    const [bulkUsers, setBulkUsers] = useState([])
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

 


    useEffect(() => {
        let url = baseURL + 'account/balance';
        axios.get(url, {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('paytmtoken')
            }
        }).then(data => {
            console.log('the data is ');
            console.log(data);
            setUser({
                ...user, balance: data.data.balance,

            })
            setLoading(false)
        }).catch(err => {
            console.log('the error is :');
            console.log(err);
            setLoading(false)
            navigate('/signin');
        })

        let userURL  = baseURL +'user/get-detail';

        axios.get(userURL,{
            headers:{
                authorization:'Bearer '+ localStorage.getItem('paytmtoken')
            }
        }).then(data=>{
            console.log('the user data is :');
            data=data.data;
            console.log();

            setMyUserState(pre=>{return {...data.user} } );
            console.log('my user state');
            console.log(myUserState);
        }).catch(err=>{
            console.log('the error is :');
            console.log(err);
            setLoading(false);
            navigate('/signin');
        })


    }, [])

    const handleSearchQuery = (e) => {

        if (interval)
            clearInterval(interval);
        setSearchQuery(e.target.value);
        console.log(e.target.value);

        interval = setTimeout(async () => {
            try {

                let data = await axios.get(baseURL + 'user/bulk?filter=' + e.target.value, {
                    headers: {
                        authorization: 'Bearer ' + localStorage.getItem('paytmtoken')
                    }
                });
                console.log('the user data is :');
                console.log(data.data.users);
                if (data.data.users) {
                    setBulkUsers(data.data.users);
                }
            } catch (error) {
                console.log(error)

            }

        }, 300);

    }

    const handleSendMoney = (userId)=>{
        console.log({userId});
        navigate('/sendmoney?userId='+userId);
    }

    if (loading) {
        return <Loading />
    }

    

    return (
        <div className='w-4/5 mx-auto my-12'>
            <h1 className='text-3xl text-gray-800 font-semibold ' >Your Balance is: {user.balance} RS</h1>
            <div>
                <h1 className='text-2xl text-gray-800 font-semibold my-4'>Users</h1>
                <input type='text' placeholder='Search User here' className='border-2 border-slate-200 w-full rounded-md py-2 px-3' value={searchQuery} onChange={(e) => handleSearchQuery(e)} />
                <ul>
                    {bulkUsers && bulkUsers.length > 0 && bulkUsers.map((bu,ind) => {
                        
                        return <li key={bu._id} className='flex  flex-row justify-between items-center py-2' >
                            <div className='flex gap-4 items-center text-xl'>
                                <span className='text-center text-gray-800 bg-slate-100 rounded-full p-3 text-xl '>U{ind+1}</span>
                                <span>{bu.firstName} {bu.lastName}</span>
                            </div>
                            <span><button type="button" onClick={()=>handleSendMoney(bu._id)} className="px-8 py-3 font-semibold rounded text-gray-100 bg-gray-800 block m-auto  w-full">Send Money</button></span>
                        </li>
                    })}
                    {/* <li className='flex  flex-row justify-between items-center py-2' >
                        <div className='flex gap-4 items-center text-xl'>
                            <span className='text-center text-gray-800 bg-slate-100 rounded-full p-3 text-xl '>U1</span>
                            <span>Juend Khan</span>
                        </div>
                        <span><button type="button" className="px-8 py-3 font-semibold rounded text-gray-100 bg-gray-800 block m-auto  w-full">Send Money</button></span>
                    </li> */}
                </ul>
            </div>
        </div>
    )
}

export default Dashboard