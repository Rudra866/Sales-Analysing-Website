import { Dispatch, SetStateAction } from 'react';
import {useArgs} from "@storybook/preview-api";
import {Args} from "@storybook/csf";

interface UseDialogControls {
  updateArgs: (newArgs: Partial<Args>) => void,
  showDialog: boolean;
  setShowDialog: Dispatch<SetStateAction<boolean>>;
}

export function useTestDialogControls(): UseDialogControls {
  const [{ showDialog }, updateArgs] = useArgs();

  const setShowDialog = (value: boolean) => {
    updateArgs({ showDialog: value });
  };

  return {
    updateArgs,
    showDialog,
    setShowDialog: setShowDialog as Dispatch<SetStateAction<boolean>>,
  };
}
