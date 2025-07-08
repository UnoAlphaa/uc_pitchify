import { auth, signOut, signIn } from "@/auth"
import { BadgePlus, LogOut } from "lucide-react";
import Image from "next/image"
import Link from "next/link"
import { Avatar, AvatarImage } from "./ui/avatar";
import { redirect } from "next/navigation";



const Navbar = async () => {
    const session = await auth();
  return (
    <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
        <nav className="flex justify-between items-center">
            <Link href="/">
                <Image src='/logo.png' alt="logo" width={144} height={30} /> 
            </Link>

            <div className="flex items-center gap-5">
                {session && session?.user? (
                    <>
                        <Link href='/startup/create'>
                            <span className="max-sm:hidden">Create</span>
                            <BadgePlus className="size-6 sm:hidden cursor-pointer" />
                        </Link>

                        <form action={async ()=> {
                            'use server';
                            await signOut();
                            redirect("/");
                        }}>
                            <button type="submit">
                                <span className="max-sm:hidden">Logout</span>
                                <LogOut className="size-6 sm:hidden cursor-pointer mt-3 " />
                            </button>
                        </form>

                        <Link href={`/user/${session?.id}`}>
                            <Avatar className="size-10">
                                <AvatarImage src={session?.user?.image || " "} 
                                alt={session?.user?.name || "User Avatar"}
                                />
                            </Avatar>
                        </Link>
                    </>
                ):
                (
                    <>
                        <form action={async ()=> {
                            "use server";
                            await signIn('github')
                            }}>
                            <button type="submit">Login</button>
                        </form>
                    </>
                )}
            </div>
        </nav>
    </header>
  )
}

export default Navbar