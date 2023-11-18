'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import {Database, getSupabaseBrowserClient} from "@/lib/database";
import {SupabaseClient} from "@supabase/supabase-js";
import dynamic from "next/dynamic";

const ChangePasswordForm = dynamic(() =>
    import("@/app/authentication/change-password/components/ChangePasswordForm"))

export default function UpdatePassword() {
  const router = useRouter();
  const supabase: SupabaseClient<Database> = getSupabaseBrowserClient();

  // todo ts:any
  const handleSubmit = async (e: any) => {
    const { data, error } = await supabase.auth.updateUser(
        { password: e.password });
    if (error) {
      console.error('Error updating password:', error);
    } else {
      console.log('Password updated successfully');
      router.push('/dashboard'); // todo add success page
    }
  };

  return (
    <ChangePasswordForm onSubmit={handleSubmit}/>
  );
}