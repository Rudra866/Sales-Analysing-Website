import FormModal, { FormModalProps } from "@/components/dialogs/form-modal";
import { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "@storybook/preview-api";
import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";

// TODO still unfinished.
export default {
  title: "Dialogs/Form Dialog",
  component: FormModal,
  parameters: {
    layout: "centered",
  },
} as Meta;

export const Default: StoryObj<FormModalProps> = {
  args: {
    title: "Empty Dialog",
    showDialog: true,
  },
  render: function Render(args) {
    const [{ showDialog }, updateArgs] = useArgs();
    const setShowDialog = (value: boolean) => {
      updateArgs({ showDialog: value });
    };
    return (
      <>
        <Button onClick={() => setShowDialog(true)}>Trigger</Button>
        <FormModal
          {...args}
          showDialog={showDialog}
          setShowDialog={setShowDialog as Dispatch<SetStateAction<boolean>>}
        >
          <div>Empty Div</div>
        </FormModal>
      </>
    );
  },
};
