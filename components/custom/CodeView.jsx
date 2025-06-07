"use client";

import React, { useContext, useEffect, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import Lookup from "@/data/Lookup";
import { MessagesContext } from "@/context/MessagesContext";
import Prompt from "@/data/Prompt";
import axios from "axios";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { useConvex } from "convex/react";
import { Loader2Icon } from "lucide-react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { countToken } from "@/components/custom/ChatView";
import SandpackPreviewClient from "./SandpackPreviewClient";

function CodeView() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("code");
  const [files, setFiles] = useState(Lookup?.DEFAULT_FILE);
  const { messages, setMessages } = useContext(MessagesContext);
  const updateFiles = useMutation(api.workspace.UpdateFiles);
  const [loading, setLoading] = useState(false);
  const convex = useConvex();
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const UpdateTokens = useMutation(api.users.UpdateToken);

  useEffect(() => {
    id && GetFiles();
  }, [id]);

  useEffect(() => {
    setActiveTab('preview');
  },[action]);

  const GetFiles = async () => {
    setLoading(true);
    const result = await convex.query(api.workspace.GetWorkspace, {
      workspaceId: id,
    });
    const mergedFils = { ...Lookup.DEFAULT_FILE, ...result?.fileData };
    setFiles(mergedFils);
    setLoading(false);
  };

  useEffect(() => {
    if (messages?.length > 0) {
      const lastMessage = messages[messages?.length - 1];
      if (lastMessage?.role == "user") {
        GenerateAiCode();
      }
    }
  }, [messages]);

  const GenerateAiCode = async () => {
    setLoading(true);
    const PROMPT = JSON.stringify(messages) + " " + Prompt.CODE_GEN_PROMPT;
    const result = await axios.post("/api/gen-ai-code", {
      prompt: PROMPT,
    });
    console.log("AI Code Response:", result.data);
    const aiResp = result.data;
    const mergedFiles = { ...Lookup.DEFAULT_FILE, ...aiResp?.files };
    setFiles(mergedFiles);
    await updateFiles({
      workspaceId: id,
      files: aiResp?.files,
    });

    const token =
      Number(userDetails?.token) - Number(countToken(JSON.stringify(aiResp)));

    await UpdateTokens({
      token: token,
      userId: userDetails?._id,
    });

    setUserDetails((prev) => ({
      ...prev,
      token: token,
    }));

    setLoading(false);
  };

  return (
    <div className="relative">
      <div className="bg-[#181818] w-full p-2 border">
        <div className="flex items-center flex-wrap shrink-0 bg-black p-1 w-[135px] gap-3 justify-center rounded-full">
          <h2
            onClick={() => setActiveTab("code")}
            className={`text-sm cursor-pointer ${activeTab == "code" && "text-blue-500 bg-blue-500/25 p-1 px-2 rounded-full"} `}
          >
            Code
          </h2>
          <h2
            onClick={() => setActiveTab("preview")}
            className={`text-sm cursor-pointer ${activeTab == "preview" && "text-blue-500 bg-blue-500/25 p-1 px-2  rounded-full"} `}
          >
            Preview
          </h2>
        </div>
      </div>
      <SandpackProvider
        theme={"dark"}
        template="react"
        files={files}
        customSetup={{
          dependencies: { ...Lookup.DEPENDANCY },
        }}
        options={{
          externalResources: ["https://cdn.tailwindcss.com"],
        }}
      >
        <SandpackLayout>
          {activeTab == "code" ? (
            <>
              <SandpackFileExplorer style={{ height: "80vh" }} />
              <SandpackCodeEditor style={{ height: "80vh" }} />
            </>
          ) : (
            <>
            <SandpackPreviewClient />
            </>
          )}
        </SandpackLayout>
      </SandpackProvider>
      {loading && (
        <div className="p-10 bg-gray-900/50 absolute top-0 rounded-lg w-full h-full flex items-center justify-center ">
          <Loader2Icon className="animate-spin h-10 w-10 text-white" />
          <h2 className="text-white text-lg font-semibold">
            Generating your files ...
          </h2>
        </div>
      )}
    </div>
  );
}

export default CodeView;
