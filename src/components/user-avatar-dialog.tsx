import {z} from "zod";
import {Dispatch, SetStateAction, useState} from "react";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {useFormModalContext} from "@/components/dialogs/FormModal";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form} from "@/components/ui/form";
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import {DialogFooter} from "@/components/ui/dialog";
import DialogCloseButton from "@/components/dialogs/DialogCloseButton";
import {Button} from "@/components/ui/button";


export const avatarSelectionSchema = z.object({
  image: z.string().nonempty()
})

function SelectableAvatar({image, selected, setSelected, selectedKey, onClick}: {
  image: string,
  selected: number,
  selectedKey:number,
  setSelected: Dispatch<SetStateAction<number>>,
  onClick: () => void
}) {
  const isSelected = selected === selectedKey;

  const handleAvatarClick = () => {
    setSelected(selectedKey);
    onClick();
  };

  return (
      // someone fix this bullshit i hate css
      <div className={`p-4 flex justify-center items-center`}>
        <button type={"button"} className={"justify-center"} onClick={handleAvatarClick}>
          <div className={`${isSelected ? 'scale-125' : ''}`}>
            <Avatar className={`${isSelected ? 'border-secondary border-solid border-2' : ''}`}>
              <AvatarImage src={`/avatars/${image}`} />
            </Avatar>
          </div>
        </button>
      </div>
  );
}


export default function UserAvatarDialog({loading}: {loading?:boolean}) {
  const formContext = useFormModalContext()
  const [selectedAvatar, setSelectedAvatar] = useState(-1)
  const [profilePics, setProfilePics] = useState<string[]>([])
  // use later

  // todo make dynamic -- probably on build time
  const profile_pics = [
    "01.png", "02.png", "03.png", "04.png",
    "01.png", "02.png", "03.png", "04.png",
    "01.png", "02.png", "03.png", "04.png",
    "01.png", "02.png", "03.png", "04.png",
  ]

  const form = useForm<z.infer<typeof avatarSelectionSchema>>({
    resolver: zodResolver(avatarSelectionSchema),
    defaultValues: {
      image: "",
    }
  })

  function handleAvatarClick(index:number) {
    form.setValue('image', profile_pics[index])
  }

  return (
      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) =>
              formContext?.onSubmit(data))} className="space-y-8">
            <DialogBody className={"flex justify-center"}>
              <div className={"grid grid-cols-3 w-full"}>
                {profile_pics.map((image, index) => (
                    <SelectableAvatar
                        onClick={() => handleAvatarClick(index)}
                        key={index}
                        image={image}
                        selectedKey={index}
                        selected={selectedAvatar}
                        setSelected={setSelectedAvatar}/>
                ))}
              </div>
            </DialogBody>
            <DialogFooter>
              <DialogCloseButton/>
              <Button type={"submit"}> Change </Button>
            </DialogFooter>
          </form>
        </Form>
      </>
  )
}
