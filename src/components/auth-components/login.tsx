'use client'

import {createClientComponentClient} from '@supabase/auth-helpers-nextjs'
import {useRouter} from 'next/navigation'
import {useState} from 'react'

import type {Database} from '@/lib/database.types'
import {Input} from "@/components/ui/input";

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()
    const supabase = createClientComponentClient<Database>()
    const [signIn, setSignIn] = useState(false)

    const handleSignUp = async () => {
        await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        })
        router.refresh()
    }

    const handleSignIn = async () => {
        await supabase.auth.signInWithPassword({
            email,
            password,
        })
        router.refresh()
        setSignIn(true)
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }

    return (
        <div className={'flex flex-col '}>
            <Input name="email" placeholder={'email'} onChange={(e) => setEmail(e.target.value)} value={email}/>
            <Input
                type="password"
                name="password"
                placeholder={'password'}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />
            <button onClick={handleSignUp}>Sign up</button>
            <button onClick={handleSignIn}>Sign in</button>
            <button onClick={handleSignOut}>Sign out</button>
            {signIn && <div>signed in</div>}
        </div>
    )
}
