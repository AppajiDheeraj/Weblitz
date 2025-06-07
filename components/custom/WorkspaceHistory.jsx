"use client";


import { UserDetailContext } from "@/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { useSidebar } from "../ui/sidebar";

function WorkSpaceHistory() {
  const { userDetails } = useContext(UserDetailContext);
  const [workspaceList, setWorkspaceList] = useState();
  const { toggleSidebar } = useSidebar();
  const convex = useConvex();

  useEffect(() => {
    userDetails && GetAllWorkspace();
  }, [userDetails]);

  const GetAllWorkspace = async () => {
    const result = await convex.query(api.workspace.GetAllWorkspace, {
      userId: userDetails?._id,
    });
    console.log("Fetched workspaces:", result);
    setWorkspaceList(result);
  };

  return (
    <div>
      <h2 className="text-lg font-medium">Your Chats</h2>
      <div>
        {workspaceList && workspaceList.length > 0 ? (
          workspaceList.map((workspace, index) => (
            <Link href={'/workspace/' + workspace?._id} key={index} >
            <h2 onClick={toggleSidebar} key={index} className="text-sm text-gray-400 mt-2 font-light cursor-pointer hover:text-white">
              {workspace?.messages?.[0]?.content || "No content"}
            </h2>
            </Link>
          ))
        ) : (
          <p className="text-sm text-red-400">No workspaces found</p>
        )}
      </div>
    </div>
  );
}

export default WorkSpaceHistory;