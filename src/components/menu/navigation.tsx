"use client"
import React from 'react';
import {MainNav} from "@/components/main-nav";
import {UserNav} from "@/components/user-nav";
import Image from "next/image";
import {MobileNav} from "@/components/mobile-nav";
import useAuth from "@/hooks/use-auth";
import Link from "next/link";

function Navigation() {
  const {employee, isLoading} = useAuth();
    return (
        <header className="border-b">
          {!isLoading && employee &&
              <>
                  <div className="hidden md:flex md:flex-row h-16 items-center px-4">
                      <Link href={"/"}>
                          <Image src={'/icon.png'} alt={'icon'} width={25} height={25} className={'mr-2'}/>
                      </Link>
                      <MainNav className="mx-6"/>
                      <div className="ml-auto flex items-center space-x-4">
                          <UserNav/>
                      </div>
                  </div>
                  <div className="container flex h-fit items-center">
                      <MobileNav/>
                  </div>
              </>
          }
        </header>
    );
}

export default Navigation;
