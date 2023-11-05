import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import React, {Dispatch, ReactNode, SetStateAction} from "react";

export interface FormModalProps {
  title: string
  showDialog: boolean;
  setShowDialog: Dispatch<SetStateAction<boolean>>;
  children?: ReactNode;
}
export default function FormModal({ title, showDialog, setShowDialog, children }: FormModalProps) {
  return (
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
  );
}