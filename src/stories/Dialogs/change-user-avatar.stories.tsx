import FormModal, { FormModalProps } from "@/components/dialogs/form-modal";
import { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "@storybook/preview-api";
import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import UserAvatarDialog from "@/components/user-avatar-dialog";

// TODO still unfinished.
export default {
  title: "Dialogs/Change User Avatar (Unfinished)",
  component: FormModal,
  parameters: {
    layout: "centered",
  },
} as Meta;

export const Default: StoryObj<FormModalProps> = {
  args: {
    showDialog: true,
  },
  render: function Render(args) {
    const [{ showDialog }, updateArgs] = useArgs();
    const setShowDialog = (value: boolean) => {
      updateArgs({ showDialog: value });
    };

    // will make this dynamic later with api call
    return (
      <>
        <Button onClick={() => setShowDialog(true)}>Trigger</Button>
        <FormModal
          {...args}
          title={"Change Avatar"}
          showDialog={showDialog}
          setShowDialog={setShowDialog as Dispatch<SetStateAction<boolean>>}
        >
          <UserAvatarDialog />
        </FormModal>
      </>
    );
  },
};
