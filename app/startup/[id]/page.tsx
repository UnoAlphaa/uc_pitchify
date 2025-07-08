import { formatDate } from '@/lib/utils';
import { client } from '@/sanity/lib/client';
import { PLAYLIST_BY_SLUG_QUERY, STARTUP_BY_ID_QUERY } from '@/sanity/lib/queries';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'

import markdowit from 'markdown-it'
import { Skeleton } from '@/components/ui/skeleton';
import View from '@/components/View';
import Navbar from '@/components/Navbar';
import StartupCard, { StartupTypeCard } from '@/components/StartupCard';


const md = markdowit();

const page = async ({params}:{params : {id: string}}) => {
    const id = (await params).id;

    const [post, {select : editorPosts} ] = await Promise.all([
        await client.fetch(STARTUP_BY_ID_QUERY, {id}),
        await client.fetch(PLAYLIST_BY_SLUG_QUERY, {slug: "editors-picks"})
    ])

    if(!post) return notFound();
    const parsedContent = md.render(post?.pitch || "");

  return (
    <>
    <Navbar/>
        <section className='pink_container !min-h-[230px] animate-in fade-in'>
            <p className='tag'>{formatDate(post?._createdAt)}</p>

            <h1 className='heading'>{post.title}</h1>
            <p className='sub-heading !max-w-5xl'>{post.description}</p>
        </section>
        <section className='section_container animate-in fade-in'>
            <img src={post.image ?? '/default-image.png'} alt="image" className='w-full h-auto rounded-xl' />

            <div className='space-y-5 mt-10 max-w-4xl mx-auto'>
                <div className='flex-between gap-5'>
                    <Link href={`/user/${post.author?._id}`} className='flex gap-2 items-center mb-3'>
                        <Image 
                        src={post.author?.image ?? '/default-avatar.png'}
                        alt='avatar'
                        width={100}
                        height={100}
                        className='rounded-full drop-shadow-lg'
                        />

                        <div>
                            <p className='text-20-medium'>{post.author?.name}</p>
                            <p className='text-16-medium !text-black-300'>@{post.author?.username}</p>
                        </div>
                    </Link>
                    <p className='category-tag'>{post.category}</p>
                </div>

                <h3 className='text-30-bold'>Pitch Details</h3>
                {parsedContent ? (
                    <article className='prose max-w-4xl font-work-sans' dangerouslySetInnerHTML={{__html:parsedContent}} /> 
                ):(
                    <p className='no-result'>No details provided</p>
                )}
                <p></p>
            </div>
            <hr className='divider' />

            { editorPosts?.length > 0 && (
                <div className='max-w-4xl mx-auto'>
                    <p className='text-30-semibold'>Editors Picks</p>
                    <ul className='mt-7 card_grid-sm'>
                        {editorPosts.map((post:StartupTypeCard, i:number)=>(
                            <StartupCard key={i} post={post} />
                        ))}
                    </ul>
                </div>
            )}


            <Suspense fallback={<Skeleton className='view_skeleton'/>}>
                    <View id={id} />

            </Suspense>
        </section>
    </>
  )
}

export default page
