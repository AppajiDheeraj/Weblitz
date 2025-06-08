"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useSidebar } from "../ui/sidebar";
import Image from "next/image";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { ArrowRight, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import Prompt from "@/data/Prompt";
import Lookup from "@/data/Lookup";

export const countToken = (inputText) => {
  return inputText.trim().split(/\s+/).filter(Boolean).length;
};

function ChatView() {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const { messages, setMessages } = useContext(MessagesContext);
  const convex = useConvex();
  const updateMessages = useMutation(api.workspace.UpdateMessages);
  const UpdateTokens = useMutation(api.users.UpdateToken);
  const { toggleSidebar } = useSidebar();
  const bottomRef = useRef(null);

  useEffect(() => {
    id && GetWorkspaceData();
  }, [id]);

  const GetWorkspaceData = async () => {
    const result = await convex.query(api.workspace.GetWorkspace, {
      workspaceId: id,
    });
    setMessages(result?.messages);
  };

  useEffect(() => {
    if (messages?.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === "user") GetAiResponse();
    }
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const GetAiResponse = async () => {
    setLoading(true);
    const prompt = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
    const result = await axios.post("/api/ai-chat", { prompt });
    const aiResp = { role: "ai", content: result.data.result };
    setMessages((prev) => [...prev, aiResp]);

    await updateMessages({
      messages: [...messages, aiResp],
      workspaceId: id,
    });

    const remainingToken =
      Number(userDetails?.token) - countToken(JSON.stringify(aiResp));

    await UpdateTokens({
      token: remainingToken,
      userId: userDetails?._id,
    });

    setUserDetails((prev) => ({ ...prev, token: remainingToken }));
    setLoading(false);
  };

  const onGenerate = async (input) => {
    if (userDetails?.token <= 20) {
      toast("You do not have enough tokens!");
      return;
    }
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setUserInput("");
  };

  return (
    <div className="relative h-[85vh] flex flex-col bg-black/0 text-white px-4 pb-4">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4 pr-2 pt-4">
        {messages?.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              msg.role === "user" ? "justify-start" : "justify-end"
            }`}
          >
            {msg.role === "user" && userDetails?.picture && (
              <Image
                src={userDetails?.picture}
                alt="User"
                width={32}
                height={32}
                className="rounded-full mt-2"
              />
            )}
            <div
              className={`max-w-[75%] p-4 rounded-2xl text-sm leading-normal shadow-xl whitespace-pre-line
    ${
      msg.role === "user"
        ? "bg-[#1b1b1b] text-white rounded-bl-none"
        : "bg-[#1a1f2e] text-gray-200 rounded-br-none"
    }`}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-end">
            <div className="bg-[#262b38] p-3 rounded-2xl shadow-md flex items-center gap-2 text-sm">
              <Loader2Icon className="animate-spin h-4 w-4 text-gray-400" />
              <span>Generating response...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Box */}
      <div className="flex items-end mt-4 gap-3">
        {userDetails && (
          <Image
            onClick={toggleSidebar}
            src={userDetails?.picture}
            alt="User"
            width={35}
            height={35}
            className="rounded-full cursor-pointer"
          />
        )}
        <div className="flex flex-col w-full max-w-3xl bg-[#1e1e1e] shadow-xl rounded-2xl p-4 border border-gray-700">
          <div className="flex items-end gap-3">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full h-20 max-h-40 resize-none outline-none bg-transparent text-white placeholder-gray-400 scrollbar-hide"
              placeholder={Lookup.INPUT_PLACEHOLDER}
            />
            {userInput && (
              <ArrowRight
                onClick={() => onGenerate(userInput)}
                className="bg-blue-500 p-2 h-10 w-10 rounded-md cursor"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatView;