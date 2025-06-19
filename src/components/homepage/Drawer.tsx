import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PanelLeft } from "lucide-react";

export default function Drawer() {
  return (
    <Sheet>
      <div className="flex mt-4 ml-4 items-center gap-4.5">
        <SheetTrigger asChild>
          <PanelLeft size={36} color="#4a4a4a" />
        </SheetTrigger>
        <p className="text-[32px] font-medium font-[Lora]">
          {" "}
          Mock Collection Name
        </p>
      </div>
      <SheetContent side="left" className="bg-[#E5DFD8]">
        <div className="flex justify-end">
          <SheetClose asChild className="mt-4 mr-4 ">
            <PanelLeft size={36} color="#4a4a4a" />
          </SheetClose>
        </div>
        <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
