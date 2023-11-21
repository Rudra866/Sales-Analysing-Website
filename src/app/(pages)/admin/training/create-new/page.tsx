'use client'
import dynamic from "next/dynamic";
const ReferenceForm = dynamic(() => import("@/admin/training/reference-form"))

function Page() {
    return (
        <div>
            <ReferenceForm />
        </div>
    );
}

export default Page;
