"use client"
import dynamic from "next/dynamic";

const TestRegistrationForm = dynamic(() => import("./components/TestRegistrationForm"));

export default function AuthRegistrationTestPage() {
  return (
      <TestRegistrationForm />
  )
};