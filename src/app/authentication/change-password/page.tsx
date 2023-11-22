'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import {Database, getSupabaseBrowserClient, SupabaseClient} from "@/lib/database";
import * as z from "zod";
import { passwordChangeFormSchema } from "@/lib/zod-schemas";
import dynamic from "next/dynamic";
import {errorToast, successToast} from "@/lib/toasts";

const ChangePasswordForm = dynamic(() => import("./components/ChangePasswordForm"))

export default function UpdatePassword() {
  const router = useRouter();
  const supabase: SupabaseClient<Database> = getSupabaseBrowserClient();

  const handleSubmit = async (formData: z.infer<typeof passwordChangeFormSchema>) => {
    const {error } = await supabase.auth.updateUser(formData);
    if (error) {
      errorToast(error.message);
    } else {
      successToast("Password updated successfully!")
      router.push('/'); // Change the path to your success page
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