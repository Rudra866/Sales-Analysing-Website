'use client'
import React from 'react';
import useAuth from "@/hooks/use-auth";
import {isAdmin} from "@/lib/utils";
import {redirect} from "next/navigation";

function Page() {
    const {role} = useAuth()
    if (role && isAdmin(role.id)) redirect('/training/create-new')
    else redirect('/training/1')
    return (
        <></>
    );
}

export default Page;
