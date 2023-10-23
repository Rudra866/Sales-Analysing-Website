"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/registry/new-york/ui/button"
import { Input } from "@/registry/new-york/ui/input"
import { Label } from "@/registry/new-york/ui/label"
// import supabase from "@/lib/supabase";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import {Database} from "@/lib/database.types";
import {useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
// import {useSupabase} from "@/components/providers";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [success, setSuccess] = React.useState(false)
  const supabase = createClientComponentClient<Database>()
  // const supabase = useSupabase().supabase
  const router = useRouter()
  const [signIn, setSignIn] = useState(false)

  // const login = async () => {
  //   if (!email) alert('Email is required')
  //   try {
  //     setIsLoading(true)
  //     let { data, error } = await supabase.auth.signInWithPassword({
  //       email: 'someone@email.com',
  //       password: 'NZvADvQYOcSPXKFuZRPI'
  //     })
  //   } catch (error) {
  //     console.log(error)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  // do sign up from settings page
  // const handleSignUp = async () => {
  //   await supabase.auth.signUp({
  //     email,
  //     password,
  //     options: {
  //       emailRedirectTo: `${location.origin}/auth/callback`,
  //     },
  //   })
  //   router.refresh()
  // }

  const handleSignIn = async () => {
    if (!email) alert('Email is required')
    try {
      setIsLoading(true)
      const {error} =
          await supabase.auth.signInWithPassword({
            email,
            password,
          })
      if (error) {setSignIn(false)
      } else setSignIn(true)
    } catch (error) {

    } finally {
        setIsLoading(false)
      router.refresh()
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSignIn}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only text-white" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
            <Input
              id="password"
              placeholder="password"
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              disabled={isLoading}
            />

          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In
          </Button>
        </div>
      </form>

      {/*<Button variant="outline" type="button" disabled={isLoading}>*/}
      {/*  {isLoading ? (*/}
      {/*    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />*/}
      {/*  ) : (*/}
      {/*    <Icons.gitHub className="mr-2 h-4 w-4" />*/}
      {/*  )}{" "}*/}
      {/*  Github*/}
      {/*</Button>*/}
      {signIn && <div>signed in</div>}
    </div>
  )
}
