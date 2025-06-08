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
import WorkSpaceHistory from "./WorkspaceHistory";
import SideBarFooter from "./SideBarFooter";
import Link from "next/link";

function AppSideBar() {
  return (
    <div>
      <Sidebar>
        <SidebarHeader className="p-5 flex flex-row items-center gap-4">
          <Image
            src={"/logo.png"}
            alt="Logo"
            width={30}
            height={30}
            className="rounded-full ml-1"
          />
          <h2 className="font-bold text-2xl">Weblitz</h2>
        </SidebarHeader>
        <hr className="my-0 border-t border-neutral-800" />
        <SidebarContent className="p-5">
          <Link href="/" passHref>
            <Button as="a" className="w-full flex items-center gap-2">
              <MessageCircleCode /> Start New Chat
            </Button>
          </Link>
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
