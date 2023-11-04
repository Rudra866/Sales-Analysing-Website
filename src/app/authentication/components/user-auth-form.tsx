import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {useRouter} from "next/navigation";
import useAuth from "@/hooks/use-auth";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { z } from 'zod';
import {getSupabaseBrowserClient} from "@/lib/database";

export type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [error, setError] = useState(null);
  const {signIn} = useAuth();
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const LoginSchema = z.object({
    email: z.string().email('Invalid email format'),
    // todo admin setting up password restraints or sane defaults?
    password: z.string().min(1, 'Password must not be empty!'),
  });

  const [formData, setFormData] =
      useState({email: '', password: '',});
  const [validationErrors, setValidationErrors] =
      useState({ email: '', password: '' });

  const resetUserPassword = async (email: string) => {
    await supabase.auth.resetPasswordForEmail(email);
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Update the form data and clear validation errors for the specific field.
    setFormData({
      ...formData,
      [name]: value,
    });
    setValidationErrors({
      ...validationErrors,
      [name]: '',
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const validatedData = LoginSchema.parse(formData);

      setIsLoading(true);
      setError(null);
      const {error} = await signIn(
          {email:validatedData.email, password:validatedData.password}
      )
      if (error) throw error;
      setSignedIn(true);
      setIsLoading(false);
      router.refresh()
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        error.issues.forEach((issue) => {
          setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [issue.path[0]]: issue.message,
          }));
        });
      } else {
        setError(error.message);
      }
      setIsLoading(false);
    }
  };

  return (
      <div className={cn("grid gap-6", className)} {...props}>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="email">
                Email
              </Label>
              <Input
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={formData.email}
                  onChange={handleChange}
              />
              {validationErrors.email && <div className="text-red-600">{validationErrors.email}</div>}
              <Label className="sr-only" htmlFor="password">
                Password
              </Label>
              <Input
                  id="password"
                  name="password"
                  placeholder="password"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="password"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={formData.password}
                  onChange={handleChange}
              />
              {validationErrors.password && <div className="text-red-600">{validationErrors.password}</div>}
              <Button type={"button"} variant={"link"} onClick={()=> resetUserPassword(formData.email)}>Forgot password?</Button>
            </div>
            <Button disabled={isLoading}>
              {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In
            </Button>
          </div>
        </form>
        <div className={"flex flex-col items-center"}>
          {error && <div className={"text-red-600"}>{error}</div>}
          {signedIn && <div className={""}>success!</div>}
        </div>
      </div>
  );
}
