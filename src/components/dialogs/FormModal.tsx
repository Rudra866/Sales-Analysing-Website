'use client'

import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import React, {createContext, Dispatch, ReactElement, ReactNode, SetStateAction, useContext, useState} from "react";

export interface FormModalProps {
  title: string
  showDialog: boolean;
  setShowDialog: Dispatch<SetStateAction<boolean>>;
  onSubmit: (data:any) => void;
  children?: ReactNode;
}

const FormModalContext = createContext<FormModalProviderProps | null>(null);
type FormModalProviderProps = {
  showDialog: boolean;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data:any) => void;
};

export const useFormModalContext = () => {
  return useContext(FormModalContext);
};

export default function FormModal({ title, showDialog, setShowDialog, onSubmit, children }: FormModalProps) {
  return (
      <FormModalContext.Provider value={{ showDialog, setShowDialog, onSubmit }}>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            {children}
          </DialogContent>
        </Dialog>
      </FormModalContext.Provider>
  );
}
