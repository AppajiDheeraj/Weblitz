"use client";

import Colors from "@/data/Colors";
import Lookup from "@/data/Lookup";
import { ArrowRight, Link } from "lucide-react";
import React from "react";
import { useState, useContext } from "react";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import SignInDialog from "./SignInDialog";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

function Hero() {
  const [userInput, setUserInput] = useState("");
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const { messages, setMessages } = useContext(MessagesContext);
  const [openDialog, setOpenDialog] = useState(false);
  const CreateWorkspace = useMutation(api.workspace.CreateWorkspace);
  const router = useRouter();
  const onGenerate = async (input) => {
    if (!userDetails?.name) {
      setOpenDialog(true);
      return;
    }
    if (userDetails?.token <= 20) {
      toast("You do not have enough tokens!");
      return;
    }
    const msg = {
      role: "user",
      content: input,
    };
    setMessages([msg]);

    const workspaceId = await CreateWorkspace({
      user: userDetails._id,
      messages: [msg],
    });
    console.log("Workspace created with ID:", workspaceId);
    router.push("/workspace/" + workspaceId);
  };

  return (
    <div className="flex flex-col items-center mt-36 xl:mt-42 gap-2">
      <h2 className="font-bold text-4xl">{Lookup.HERO_HEADING}</h2>
      <p className="text-gray-400 font-medium">{Lookup.HERO_DESC}</p>
      <div
        className="p-3 border rounded-xl max-w-xl w-full mt-3 "
        style={{ backgroundColor: Colors.BACKGROUND }}
      >
        <div className="flex gap-3">
          <textarea
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

      <div className="flex flex-wrap max-w-2xl justify-center items-center gap-3 mt-8">
        {Lookup.SUGGSTIONS.map((suggestions, index) => (
          <h2
            onClick={() => onGenerate(suggestions)}
            className="p-1 px-2 border rounded-full text-sm text-gray-400 hover:text-white cursor-pointer "
            key={index}
          >
            {suggestions}
          </h2>
        ))}
      </div>
      <SignInDialog
        openDialog={openDialog}
        closeDialog={(v) => setOpenDialog(v)}
      />
    </div>
  );
}

export default Hero;
