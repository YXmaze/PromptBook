import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SideBar() {
  return (
    <Sidebar>
      <SidebarHeader className="bg-[#E5DFD8]">
        <p>Logo</p>
        <Button className="bg-[#434952] font-[Lora] rounded-4xl w-[146px] h-[53px] text-[22px]">
          <Plus color="#F4F3EF" className="!size-9" /> Create
        </Button>
        <hr className="my-2 border-t border-black" />
      </SidebarHeader>
      <SidebarContent className="bg-[#E5DFD8]">
        <div className="flex flex-col ml-3 gap-2">
          <p className="font-[Lora] text-xl">Your Collection</p>
          <Input
            className="rounded-4xl w-[261px] h-[42px] bg-[#F4F3EF]"
            placeholder="Search"
          ></Input>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
