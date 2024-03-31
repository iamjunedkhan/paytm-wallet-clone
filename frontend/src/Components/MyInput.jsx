import React from 'react'

const MyInput = ({title,type='text',}) => {
    return (
        <div className='flex flex-col'>
            <label htmlFor='firstName' className='text-xl my-2 font-bold' >First Name</label>
            <input type='text' className='border-2  border-slate-200 focus:border-black p-2 rounded-lg px-3' value={formik.firstName} onChange={formik.handleChange} name='firstName' />
        </div>
    )
}

export default MyInput