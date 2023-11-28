import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Employee} from "@/lib/database";

export default function EmployeeAvatar({employee, notify = false}: { employee?: Employee | null, notify?: boolean }) {
  return (
      <div>
          {notify &&
              <span className="relative flex h-3 w-3 z-10 pt-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ADFA1D] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ADFA1D]"></span>
            </span>}
          <Avatar className="h-9 w-9">
              <AvatarImage src={`/avatars/${employee?.Avatar}`} alt="Avatar" className={""}/>
              <AvatarFallback>{employee?.Name[0] ?? 'U'}</AvatarFallback>
          </Avatar>
      </div>
  );
}
