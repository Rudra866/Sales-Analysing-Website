import {Meta, StoryObj} from "@storybook/react";
import {Toaster} from "@/components/ui/toaster";
import {useToast} from "@/components/ui/use-toast";
import {Button} from "@/components/ui/button";

export default {
  title: 'Chadcn/Toasts',
  component: Toaster,
  decorators: [(Story) => (
      <>
        <Toaster/>
        <Story/>
      </>
  ),
  ],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    title: {
      type: "string",
      control: "text"
    },
    description: {
      type: "string",
      control: "text"
    },
    action: {

    }

  }
} as Meta;

export const Default: StoryObj<typeof Toaster> = {
  args: {
    title: "Title",
    description: "",
  },
  render: function Render(args: any) {
    const {toast} = useToast()
    return (
        <>
          <Button onClick={() => {
            toast({...args})
          }}>Trigger</Button>
        </>
    )
  },
};
