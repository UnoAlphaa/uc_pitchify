"use client"
import React, { useActionState, useState } from 'react'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea';
import MDEditor from '@uiw/react-md-editor';
import { Button } from './ui/button';
import { Send } from 'lucide-react';
import { formSchema } from '@/lib/validation';
import {z} from 'zod'
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createPitch } from '@/lib/actions';

const StartupForm = () => {
    const [error, setError] = useState<Record<string, string>>({});
    const [pitch, setPitch] = useState("");
    const {toast} = useToast();
    const router = useRouter();

    const handleFormSubmit = async (prevState : any, formdata: FormData)=>{
        try {
            const formValues = {
                title : formdata.get("title") as string,
                description : formdata.get('description') as string,
                category : formdata.get('category') as string,
                link : formdata.get('link') as string,
                pitch,
            }
            await formSchema.parseAsync(formValues);


            const result = await createPitch(prevState, formdata, pitch);

            // Simulating a successful form submission
           if(result.status === "SUCCESS"){
                toast({
                    title: "Startup Pitch Submitted",
                    description: "Your startup pitch has been successfully submitted.",
                });
                router.push(`/startup/${result._id}`); 
            }
            return result;

        }catch(error){
            if(error instanceof z.ZodError){
                const fieldErrors = error.flatten().fieldErrors;
                setError(fieldErrors as unknown as Record<string, string>);
                toast({
                    title: "Validation Error",
                    description: "Please check the form fields for errors.",
                    variant: "destructive"
                });
                return {...prevState, error: 'validation failed', status:"ERROR"}
            }

            toast({
                title: "An unexpected error occurred",
                description: "Please try again later.",
                variant: "destructive"
            });
            return {
                ...prevState,
                error : "An Unexpected error has occured",
                status : "ERROR"
                

            }
        }
    };


    const [state, formAction, isPending] = useActionState(handleFormSubmit,{
        error : "",
        status : "INITIAL"
    } );

  return (
    <form action={formAction} className='startup-form'>
        <div>
            <label htmlFor="title" className='startup-form_label'>Title</label>
            <Input 
            id='title'
            name='title'
            className='startup-form_input'
            required
            placeholder='Startup title'
            />
            {error.title && <p className='startup-form_error'>{error.title}</p>}
        </div>

        <div>
            <label htmlFor="description" className='startup-form_label'>Description</label>
            <Textarea 
            id='description'
            name='description'
            className='startup-form_textarea'
            required
            placeholder='Startup Description'
            />
            {error.description && <p className='startup-form_error'>{error.description}</p>}
        </div>

        <div>
            <label htmlFor="category" className='startup-form_label'>Category</label>
            <Input 
            id='category'
            name='category'
            className='startup-form_input'
            required
            placeholder='Startup Category (Tech, Health, etc.)' 
            />
            {error.category && <p className='startup-form_error'>{error.category}</p>}
        </div>

        <div>
            <label htmlFor="link" className='startup-form_label'>Image URL</label>
            <Input 
            id='link'
            name='link'
            className='startup-form_input'
            required
            placeholder='Image URL (https://example.com/image.jpg)' 
            />
            {error.link && <p className='startup-form_error'>{error.link}</p>}
        </div>

        <div data-color-mode="light">
            <label htmlFor="pitch" className='startup-form_label'>Pitch</label>
            <MDEditor 
            value={pitch}
            onChange={(value)=>setPitch(value as string)}
            id='pitch'
            preview='edit'
            height={300}
            style={{borderRadius: 20, overflow: 'hidden'}}
            textareaProps={{
                placeholder: 'Write your pitch here...',
            }}
            previewOptions={{
                disallowedElements: ['style'],
            }}
            />
            {error.pitch && <p className='startup-form_error'>{error.pitch}</p>}
        </div>
        
        <Button type='submit' className='startup-form_btn text-white' disabled={isPending}>
            {isPending ? 'Submitting...' : 'Submit Your Pitch'}
            <Send className='ml-2 size-6' />
        </Button>
    </form>
  )
}

export default StartupForm