'use client'

// import { UserAuthForm } from "./components/user-auth-form"
import Image from "next/image";
import * as React from "react";
import ContainerLayout from "@/components/container-layout";
import dynamic from "next/dynamic";
import {cn} from "@/lib/utils";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import FormModal from "@/components/dialogs/FormModal";
import ForgotPasswordDialog from "@/components/dialogs/ForgotPasswordDialog";

const UserAuthForm = dynamic(() => import('./components/user-auth-form'))

/**
 * Allows the user to login using the {@link UserAuthForm} component.
 * @group Next.js Pages
 * @route `/authentication`
 */
export default function AuthenticationPage() {
  return (
    <ContainerLayout>
      <div className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 ">
        <Image src={'/images/logo.png'} alt={'icon'} width={120} height={50} className={"absolute right-4 top-4 md:right-8 md:top-8"}/>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex ">
          <Image src={'/images/img1.jpg'} alt={'decorative sidebar image'} fill sizes={'100%'} className={'grayscale-[25%]'}/>
        </div>
        <UserAuthForm/>
      </div>
    </ContainerLayout>
  )
}
