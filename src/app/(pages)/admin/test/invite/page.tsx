"use client"
import React from "react";
import dynamic from "next/dynamic";

const TestInviteForm = dynamic(() => import("./components/TestInviteForm"))

export default function AuthInviteTestPage() {
  return (
    <TestInviteForm/>
  )
};
