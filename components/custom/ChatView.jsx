"use client";

import React, { useContext, useEffect } from "react";
import { useParams } from "next/navigation";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MessagesContext } from "@/context/MessagesContext";
import Colors from "@/data/Colors";
import { UserDetailContext } from "@/context/UserDetailContext";
import Image from "next/image";
import { ArrowRight, Link, Loader2Icon } from "lucide-react";
import Lookup from "@/data/Lookup";
import { useState } from "react";
import axios from "axios";
import Prompt from "@/data/Prompt";
// import { UpdateMessages } from "@/convex/workspace";
import { useMutation } from "convex/react";
import ReactMarkdown from "react-markdown";
import { useSidebar } from "../ui/sidebar";
import { toast } from "sonner";

export const countToken = (inputText) => {
  return inputText
    .trim()
    .split(/\s+/)
    .filter((word) => word).length;
};

function ChatView() {
  const [userInput, setUserInput] = useState("");
  const { id } = useParams();
  const convex = useConvex();
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const { messages, setMessages } = useContext(MessagesContext);
  const [loading, setLoading] = useState(false);
  const updateMessages = useMutation(api.workspace.UpdateMessages);
  const { toggleSidebar } = useSidebar();
  const UpdateTokens = useMutation(api.users.UpdateToken);

  useEffect(() => {
    id && GetWorkspaceData();
  }, [id]);

  const GetWorkspaceData = async () => {
    const result = await convex.query(api.workspace.GetWorkspace, {
      workspaceId: id,
    });
    setMessages(result?.messages);
    console.log("Workspace Data:", result);
  };

  useEffect(() => {
    console.log("Messages updated:", messages);
    if (messages?.length > 0) {
      const lastMessage = messages[messages?.length - 1];
      console.log("Last message role:", lastMessage?.role);
      if (lastMessage?.role == "user") {
        GetAiResponse();
      }
    }
  }, [messages]);

  const GetAiResponse = async () => {
    setLoading(true);
    const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
    const result = await axios.post("/api/ai-chat", {
      prompt: PROMPT,
    });
    console.log("AI Response:", result.data.result);
    const aiResp = {
      role: "ai",
      content: result.data.result,
    };

    setMessages((prev) => [...prev, aiResp]);

    await updateMessages({
      messages: [...messages, aiResp],
      workspaceId: id,
    });
    
    const token = Number(userDetails?.token) - Number(countToken(JSON.stringify(aiResp)));

    await UpdateTokens({
      token: token,
      userId: userDetails?._id,
    });

        setUserDetails(prev => ({
        ...prev,
        token: token,
      }
    ))

    setLoading(false);
  };

  const onGenerate = async (input) => {
    if(userDetails?.token <= 20) {
      toast('You do not have enough tokens!')
      return;
    }
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: input,
      },
    ]);
    setUserInput("");
  };

  return (
    <div className="relative h-[85vh] flex flex-col ">
      <div className="flex-1 overflow-y-scroll scrollbar-hide pl-5 ">
        {messages?.map((msg, index) => (
          <div
            key={index}
            className="p-3 rounded-lg mb-2 flex gap-2 items-start"
            style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
          >
            {msg?.role === "user" && (
              <Image
                src={userDetails?.picture}
                alt="userImage"
                width={35}
                height={35}
                className="rounded-full"
              />
            )}
            <div className="flex flex-col">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
          <div
            className="p-3 rounded-lg mb-2 flex gap-2 items-start leading-7"
            style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
          >
            <Loader2Icon className="animate-spin h-5 w-5 text-gray-400" />
            <h2>Generating Response... </h2>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="flex gap-2 items-end">
        { userDetails && <Image className="rounded-full" onClick={toggleSidebar} src={userDetails?.picture} alt='user' width={30} height={30}></Image>}
      <div
        className="p-3 border rounded-xl max-w-xl w-full mt-3 "
        style={{ backgroundColor: Colors.BACKGROUND }}
      >
        <div className="flex gap-3">
          <textarea
            value={userInput}
            onChange={(event) => {
              setUserInput(event.target.value);
            }}
            className="outline-none w-full bg-transparent h-32 max-h-56 resize-none"
            placeholder={Lookup.INPUT_PLACEHOLDER}
          />
          {userInput && (
            <ArrowRight
              onClick={() => onGenerate(userInput)}
              className="bg-blue-500 p-2 h-10 w-10 rounded-md cursor"
            />
          )}
        </div>
        <Link className="h-5 w-5" />
      </div>
      </div>
    </div>
  );
}

export default ChatView;
