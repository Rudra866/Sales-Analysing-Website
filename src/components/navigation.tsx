import React from 'react';
import TeamSwitcher from "@/components/team-switcher";
import {MainNav} from "@/components/main-nav";
import {Search} from "@/components/search";
import {UserNav} from "@/components/user-nav";
import Image from "next/image";

function Navigation() {
    return (
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                <Image src={'/logo.png'} alt={'icon'} width={100} height={60} className={'mr-2'}/>
                <MainNav className="mx-6" />
                <div className="ml-auto flex items-center space-x-4">
                    <Search />
                    <TeamSwitcher />
                    <UserNav />
                </div>
            </div>
        </div>
    );
}

export default Navigation;
