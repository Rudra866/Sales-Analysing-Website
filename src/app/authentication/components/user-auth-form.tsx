import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {useRouter} from "next/navigation";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { z } from 'zod';
import {getSupabaseBrowserClient} from "@/lib/database";
import FormModal from "@/components/dialogs/FormModal";
import ForgotPasswordDialog from "@/components/dialogs/ForgotPasswordDialog";
import {forgotPasswordDialogSchema, LoginSchema} from "@/lib/zod-schemas";

export type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

export default function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [error, setError] = useState(null);

  const [passwordDialogOpen, setPasswordDialogOpen] = useState<boolean>(false)
  const [passwordResetSuccess, setPasswordResetSuccess] = useState<boolean>(false)
  const [passwordResetError, setPasswordResetError] = useState<string | null>(null)


  const supabase = getSupabaseBrowserClient();
  const router = useRouter();

  const [formData, setFormData] =
      useState({email: '', password: '',});
  const [validationErrors, setValidationErrors] =
      useState({ email: '', password: '' });

  function showPasswordResetDialog() {
    setPasswordDialogOpen(true);
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

  const resetUserPassword = async (data: z.infer<typeof forgotPasswordDialogSchema>) => {
    const {error} = await supabase.auth.resetPasswordForEmail(data.email);
    const message = error?.message;
    if (message) setPasswordResetError(message)
    else setPasswordResetSuccess(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const validatedData = LoginSchema.parse(formData);

      setIsLoading(true);
      setError(null);
      const {error} = await supabase.auth.signInWithPassword({
        email:validatedData.email,
        password:validatedData.password
      });

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
  // TODO replace this with react-hook table
  return (
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Login to your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to login
            </p>
          </div>
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
                  <Button type={"button"} variant={"link"} onClick={()=> showPasswordResetDialog()}>Forgot password?</Button>
                </div>
                <Button disabled={isLoading}>
                  {isLoading && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {signedIn && (
                      <Icons.check className="text-green-700" data-testid="success"/>
                  )}
                  {error && (
                      <Icons.warning className="text-red-500"/>
                  )}
                  {!signedIn && !isLoading && !error && "Sign In"}
                </Button>
              </div>
            </form>
            <div className={"flex flex-col items-center"}>
              {error && <div className={"text-red-600"}>{error}</div>}
            </div>
            <FormModal
                showDialog={passwordDialogOpen} setShowDialog={setPasswordDialogOpen}
                onSubmit={resetUserPassword}
                title={"Request Password Reset"}
            >
              <ForgotPasswordDialog
                  success={passwordResetSuccess}
                  setSuccess={setPasswordResetSuccess}
                  error={passwordResetError}
                  setError={setPasswordResetError}
              />
            </FormModal>
          </div>
        </div>
      </div>
  );
}
