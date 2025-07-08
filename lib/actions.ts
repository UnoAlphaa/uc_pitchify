"use server"

import { auth } from "@/auth"
import { parseServerActionResponse } from "./utils";
import { error } from "console";
import slugify from "slugify";
import { image } from "@uiw/react-md-editor";
import { writeClient } from "@/sanity/lib/write-client";

export const createPitch = async (prevState:any, formData: FormData, pitch: string)=> {
    const session = await auth();

    if(!session) return parseServerActionResponse({
        error : "Not signed in",
        status : "ERROR"
    });

    const {title, description, category, link} = Object.fromEntries(
        Array.from(formData.entries()).filter(([key]) => key !== 'pitch')
    );

    const slug = slugify(title as string, {
        lower: true,
        strict: true,
    });
    try{ 
        const startup = {
            title,
            description,
            category,
            image: link,
            slug : {
                _type: slug,
                current: slug,
            },
            author : {
                _type : "reference",
                _ref : session?.id,
            },
            pitch,
        };

        const result = await writeClient.create({_type: "startup", ...startup});
        return parseServerActionResponse({
            ...result,
            error : "",
            status: "SUCCESS",
        })

    }catch(error) {
        console.error("Error creating pitch:", error);
        return parseServerActionResponse({
            error: "An unexpected error occurred",
            status: "ERROR"
        });
    }


}