import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export default function SideBar() {
  return (
    <Sidebar>
      <SidebarHeader className="bg-[#E5DFD8]" />
      <SidebarContent className="bg-[#E5DFD8]" />
    </Sidebar>
  );
}
