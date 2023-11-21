import {toast} from "@/components/ui/use-toast";


export function errorToast(message: string) {
  return toast({
    title: "Error!",
    description: message,
    variant: "destructive"
  })
}

export function successToast(message: string) {
  return toast({
    title: "Success!",
    description: message,
    variant: "default"
  })
}