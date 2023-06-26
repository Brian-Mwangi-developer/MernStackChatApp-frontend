import React from 'react'
import { Sidebar } from '../components/Sidebar'
import { MessageForm } from '../components/MessageForm'

export const Chat = () => {
  return (
    <div className='flex px-4 py-2.5'>
      <div className='w-4/12'>
        <Sidebar /> 
        </div>
      <div className='w-8/12'>
        <MessageForm />
      </div>
    </div>
  )
}
