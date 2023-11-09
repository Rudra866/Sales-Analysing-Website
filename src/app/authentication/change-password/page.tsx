'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import {Database, getSupabaseBrowserClient, SupabaseClient} from "@/lib/database";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {passwordFieldSchema} from "@/lib/types";
import { passwordChangeFormSchema } from "./components/ChangePasswordForm";
import dynamic from "next/dynamic";

const ChangePasswordForm = dynamic(() => import("./components/ChangePasswordForm"))

// todo probably move this page, or at least redesign it completely and use it in the auth flow (currently unused)

export default function UpdatePassword() {
  const router = useRouter();
  const supabase: SupabaseClient<Database> = getSupabaseBrowserClient();

  const handleSubmit = async (formData: z.infer<typeof passwordChangeFormSchema>) => {
    const {error } = await supabase.auth.updateUser(formData);
    if (error) {
      console.error('Error updating password:', error);
    } else {
      console.log('Password updated successfully');
      router.push('/dashboard'); // Change the path to your success page
    }
  };

  return (
      <div className={"flex"}>
        <div className={"flex items-center justify-center mx-4 my-4"}>
          <ChangePasswordForm onSubmit={handleSubmit}/>
        </div>
      </div>
  );
}