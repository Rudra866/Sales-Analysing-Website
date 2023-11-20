import {toast} from "@/components/ui/use-toast";


export function errorToast(message: string) {
  return toast({
    title: "Error",
    description: message,
    variant: "destructive"
  })
}