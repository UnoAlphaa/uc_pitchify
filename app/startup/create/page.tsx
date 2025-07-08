import { auth } from '@/auth'
import Navbar from '@/components/Navbar';
import StartupForm from '@/components/StartupForm'
import { redirect } from 'next/navigation';
import React from 'react'

const page = async() => {
    const session = await auth();

    if(!session) redirect('/');

  return (
      <>
        <Navbar/>
          <section className="pink_container !min-h-[230px] animate-in fade-in">
              <h1 className='heading'>submit your pitch</h1>
          </section>
          <StartupForm />
      </>
  )
}

export default page
