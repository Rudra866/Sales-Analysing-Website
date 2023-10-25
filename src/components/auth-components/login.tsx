'use client'

// unneeded
import {useRouter} from 'next/navigation'
import * as React from 'react'
import {useState} from 'react'
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import {Database} from "@/lib/database.types";
import {Icons} from "@/components/icons";

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [signIn, setSignIn] = useState(false)


  const handleSignUp = async () => {
    const EmployeeNumber = "12345"
    const Name = "Test Employee"
    const Email = "testing@example.com"
    const Role = 1
    const Password = "password1"

    try {
      const { error:authError } = await supabase.auth.signUp({
        email:Email,
        password:Password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
          data: {
            number: EmployeeNumber,
            name: Name,
            role: Role
          }
        },
      });
      const {error:retrieveError } =  await supabase
          .from("Employees")
          .insert([
            {
              EmployeeNumber: EmployeeNumber,
              Name: Name,
              Email: Email,
              Role: Role,
              Password: "*"
            }
          ]).select().single();

      if (authError) throw authError;
      if (retrieveError) throw retrieveError;


    } catch (e) {
      console.log(e);
    }
      router.refresh()
    }

    const handleSignIn = async () => {
        const {error} =
            await supabase.auth.signInWithPassword({
            email,
            password,
        })
        router.refresh()
        if (error) {setSignIn(false)
        } else setSignIn(true)
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }

    return (
        <div className={'flex flex-col gap-2'}>
            <Input name="email" placeholder={'email'} onChange={(e) => setEmail(e.target.value)} value={email}/>
            <Input
                type="password"
                name="password"
                placeholder={'password'}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />
            <Button variant={'outline'} onClick={handleSignIn}>Sign in</Button>
            <Button variant="outline" type="button"
                    onClick={() =>
                        supabase.auth.signInWithOAuth({ provider: "github" })
                    }>
                <Icons.gitHub className="mr-2 h-4 w-4" />Sign in with Github
            </Button>
            <Button variant={'outline'} onClick={handleSignUp}>Sign up</Button>
            <Button variant={'outline'} onClick={handleSignOut}>Sign out</Button>
            {signIn && <div>signed in</div>}

        </div>
  )
}
