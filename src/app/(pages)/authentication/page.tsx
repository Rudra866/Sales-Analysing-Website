'use client'

import { UserAuthForm } from "./components/user-auth-form"
import Image from "next/image";
import * as React from "react";

/**
 * Allows the user to login using the {@link UserAuthForm} component.
 * @group Next.js Pages
 * @route `/authentication`
 */
export default function AuthenticationPage() {
  return (
    <>
      <div className="md:hidden">
        {/*todo use tabs for this*/}

      </div>
      <div className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 ">
        <Image src={'/images/logo.png'} alt={'icon'} width={120} height={50} className={"absolute right-4 top-4 md:right-8 md:top-8"}/>

        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex ">
          <div className="absolute inset-0 bg-zinc-900 bg-[url('/img4.jpg')" />
          <Image src={'/images/img2.jpg'} alt={'icon'} fill sizes={'100%'} className={'grayscale-[25%]'}/>
          <div className="relative z-20 flex items-center text-lg font-medium">

          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Login to your account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to login
              </p>
            </div>
            <UserAuthForm />
          </div>
        </div>
      </div>
    </>
  )
}
