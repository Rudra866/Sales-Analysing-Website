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

// TODO still unfinished.


const avatarSelectionSchema = z.object({
  test: z.string(),
  test1: z.string(),
  test2: z.string(),
  test3: z.string(),
  test4: z.string()
})

function SelectableAvatar({selected, setSelected, selectedKey}: {selected: string, selectedKey:string, setSelected: Dispatch<SetStateAction<string>>}) {
  const isSelected = selected === selectedKey;

  const handleAvatarClick = () => {
    console.log(selected === selectedKey, selected, selectedKey)
    setSelected(selectedKey);
  };

  return (
      <div>
        <button onClick={handleAvatarClick}>
          {isSelected ?
              <>
                Selected
                <Avatar>
                    <AvatarImage src={"/avatars/01.png"}/>
                </Avatar>
              </>
              :
              <Avatar>
                <AvatarImage src={"/avatars/01.png"}/>
              </Avatar>
          }

        </button>
      </div>
  );
}
const profile_pics = ["01.png", "02.png", "03.png", "04.png"]
let test = profile_pics.concat(["01.png", "02.png", "03.png", "04.png"])
test = test.concat(["01.png", "02.png", "03.png", "04.png"])
test = test.concat(["01.png", "02.png", "03.png", "04.png"])
test = test.concat(["01.png", "02.png", "03.png", "04.png"])

function Component() {
  const formContext = useFormModalContext()
  const [selectedAvatar, setSelectedAvatar] = useState("4")

  const form = useForm<z.infer<typeof avatarSelectionSchema>>({
    resolver: zodResolver(avatarSelectionSchema),
    defaultValues: {
      test: "",
    }
  })

  return (
      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) =>
              formContext?.onSubmit(data))} className="space-y-8">
            <DialogBody>
              <div className={"m-8 grid grid-flow-col gap-1 max-h-10"}>
                <SelectableAvatar selectedKey={"1"} selected={selectedAvatar} setSelected={setSelectedAvatar}/>
                <SelectableAvatar selectedKey={"2"} selected={selectedAvatar} setSelected={setSelectedAvatar}/>
                <SelectableAvatar selectedKey={"3"} selected={selectedAvatar} setSelected={setSelectedAvatar}/>
                <SelectableAvatar selectedKey={"4"} selected={selectedAvatar} setSelected={setSelectedAvatar}/>
                <SelectableAvatar selectedKey={"5"} selected={selectedAvatar} setSelected={setSelectedAvatar}/>
                <SelectableAvatar selectedKey={"6"} selected={selectedAvatar} setSelected={setSelectedAvatar}/>
              </div>
            </DialogBody>
            <DialogFooter>
              <DialogCloseButton/>
              <Button type={"submit"}> Create </Button>
            </DialogFooter>
          </form>
        </Form>
      </>
  )
}

export default {
  title: 'Dialogs/Change User Avatar',
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

            <Component/>

          </FormModal>
        </>
    )
  },
}