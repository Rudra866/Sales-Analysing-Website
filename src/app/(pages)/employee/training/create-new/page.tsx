'use client'


import {ReferenceForm} from "@/app/(pages)/training/reference-form";
function Page(props:any) {
    console.log('ref page props', props)
    return (
        <div>
            <ReferenceForm />
        </div>
    );
}

export default Page;
