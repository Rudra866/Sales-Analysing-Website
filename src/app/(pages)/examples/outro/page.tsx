import React from 'react';
import Link from "next/link";
import Image from "next/image";

function Page() {
    return (
        <div className={'container items-center justify-center h-screen w-screen flex'}>
            <Image src={'/logo.webp'} alt={'icon'} width={300} height={300} className={'mr-2'}/>
        </div>
    );
}

export default Page;
