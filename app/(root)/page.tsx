import React from 'react'
import SearchForm from '../../components/SearchForm'
import StartupCard, {StartupTypeCard} from '@/components/StartupCard';
import { STARTUPS_QUERY } from '@/sanity/lib/queries';
import { sanityFetch, SanityLive } from '@/sanity/lib/live';
import { auth } from '@/auth';



const Home = async ({searchParams}:{searchParams : {query? : string}}) => {
    const query = (await searchParams).query;

    //const posts = await client.fetch(STARTUPS_QUERY);
    const params = {search: query || null};

    const session = await auth();
   //console.log(session)

    const {data : posts} = await sanityFetch({query : STARTUPS_QUERY, params});

    
  return (
    <>
      <section className='pink_container animate-in fade-in'>
        <h1 className='heading'>Pitch your Startup, <br />Connect with Entrepreneurs.</h1>

        <p className='sub-heading !max-w-3xl'>
          Submit Ideas, Vote on Pitches, and get Noticed in Virtual competitions.
        </p>

        <SearchForm query={query}/>
      </section>

      <section className='section_container animate-in fade-in'>
            <p className='text-30-semibold'>
                {query ? `Search Result for ${query}` : 'All StartUps'}
            </p>

            <ul className='mt-7 card_grid'>
              {posts?.length > 0 ? (
                posts.map((post : any)=>(
                    <StartupCard key={post?._id} post={post}/>
                ))
              ) : (

                <p className='no-results'>No StartUps Found</p>
              )}
            </ul>
      </section>
      
              <SanityLive/>
    </>
  )
}

export default Home
