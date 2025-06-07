import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Button } from "../ui/button";
import { MessageCircleCode } from "lucide-react";
import WorkSpaceHistory from "./WorkSpaceHistory";
import SideBarFooter from "./SideBarFooter";

function AppSideBar() {
  return (
    <div>
      <Sidebar>
        <SidebarHeader className="p-5">
          <Image
            src={"/logo.png"}
            alt="Logo"
            width={30}
            height={30}
            className="rounded-full"
          />
        </SidebarHeader>
        <SidebarContent className="p-5">
          <Button>
            <MessageCircleCode /> Start New Chat{" "}
          </Button>
          <SidebarGroup>
            <WorkSpaceHistory />
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SideBarFooter />
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}

export default AppSideBar;
