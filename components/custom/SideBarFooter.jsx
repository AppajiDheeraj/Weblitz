"use client";
import { HelpCircle, LogOut, Settings, Wallet } from "lucide-react";
import React, { useContext } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { UserDetailContext } from "@/context/UserDetailContext";

function SideBarFooter() {
  const { userDetails, setUserDetails } = useContext(UserDetailContext)
  const router = useRouter();
  const options = [
    {
      name: "Settings",
      icon: Settings,
      path: "/settings"
    },
    {
      name: "Help Center",
      icon: HelpCircle,
      path: "/help"
    },
    {
      name: "My Subscription",
      icon: Wallet,
      path: "/pricing",
    },
    {
      name: "Sign Out",
      icon: LogOut,
    },
  ];
  const onOptionClick = (option) => {
    if (option?.name === "Sign Out") {
      localStorage.removeItem("user");
      setUserDetails(null);
      router.push("/");
    } else if (option.path) {
      router.push(option.path);
    }
  };

  return (
    <div className="p-2 mb-10">
      {options.map((option, index) => (
        <Button
          onClick={() => onOptionClick(option)}
          key={index}
          variant="ghost"
          className="w-full flex justify-start my-3"
        >
          <option.icon />
          {option.name}
        </Button>
      ))}
    </div>
  );
}

export default SideBarFooter;