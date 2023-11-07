import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Employee} from "@/lib/database";


export default function EmployeeAvatar({employee}: { employee?: Employee }) {
  return (
      <Avatar className="h-9 w-9">
        <AvatarImage src={`/avatars/${employee?.Avatar ?? "01.png"}`} alt="Avatar"/>
        <AvatarFallback>{employee?.Name[0] ?? 'U'}</AvatarFallback>
      </Avatar>
  );
}