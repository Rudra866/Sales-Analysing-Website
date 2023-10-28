"use client"
import React from 'react';
import TeamSwitcher from "@/components/dashboard-components/team-switcher";
import {MainNav} from "@/components/main-nav";
import {Search} from "@/components/dashboard-components/search";
import {UserNav} from "@/components/dashboard-components/user-nav";
import Image from "next/image";
import {MobileNav} from "@/components/mobile-nav";
import useAuth from "@/hooks/use-auth";
// import {ModeToggle} from "@/components/mode-toggle";

function Navigation() {
  const {user} = useAuth();
    return (
        <header className="border-b">
          {/*{user &&*/}
              <>
                  <div className="hidden md:flex md:flex-row h-16 items-center px-4">
                      <Image src={'/icon.png'} alt={'icon'} width={25} height={25} className={'mr-2'}/>
                      <MainNav className="mx-6"/>
                      <div className="ml-auto flex items-center space-x-4">
                          <Search/>
                          <TeamSwitcher/>
                          <UserNav/>
                        {/*<ModeToggle />*/}
                      </div>
                  </div>
                  <div className="container flex h-fit items-center">
                      <MobileNav/>
                  </div>
              </>
          {/*}*/}
        </header>
    );
}

export default Navigation;
