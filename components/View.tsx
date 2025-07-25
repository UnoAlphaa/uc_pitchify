import React from 'react'
import Ping from '@/components/Ping';
import { client } from '@/sanity/lib/client';
import { STARTUP_VIEWS_QUERY } from '@/sanity/lib/queries';
import { writeClient } from '@/sanity/lib/write-client';

const View = async ({id}: {id : string}) => {
    const totalViews = await client.withConfig({useCdn : false})
    .fetch(STARTUP_VIEWS_QUERY, {id})
    const views = typeof totalViews?.views === 'number' ? totalViews.views : 0;

    await writeClient.patch(id).set({views : views + 1})
    .commit();

    
    
  return (
    <div className='view-container'>
        <div className="absolute -top-2 -right-2">
            <Ping />
        </div>

        <p className='view-text'>
            <span className='font-black'>views: {views}</span>
        </p>
    </div>
  )
}

export default View