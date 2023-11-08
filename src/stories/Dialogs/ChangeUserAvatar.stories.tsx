import FormModal, {FormModalProps, useFormModalContext} from "@/components/FormModal";
import {Meta, StoryObj} from "@storybook/react";
import {useArgs} from "@storybook/preview-api";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import {DialogFooter} from "@/components/ui/dialog";
import {useForm, useFormContext} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import DialogCloseButton from "@/components/DialogCloseButton";
import ChangeUserAvatarDialog from "@/components/ChangeUserAvatarDialog";

// TODO still unfinished.
export default {
  title: 'Dialogs/Change User Avatar (Unfinished)',
  component: FormModal,
  parameters: {
    layout: "centered"
  }
} as Meta;

export const Default: StoryObj<FormModalProps> = {

  args: {
    showDialog: true,
  },
  render: function Render(args){
    const [{showDialog}, updateArgs] = useArgs();
    const setShowDialog = (value: boolean) => {
      updateArgs({showDialog: value})
    }

    // will make this dynamic later with api call
    return (
        <>
          <Button onClick={() => setShowDialog(true)}>Trigger</Button>
          <FormModal
              {...args}
              title={"Change Avatar"}
              showDialog={showDialog}
              setShowDialog={setShowDialog as Dispatch<SetStateAction<boolean>>}>
            <ChangeUserAvatarDialog/>
          </FormModal>
        </>
    )
  },
}