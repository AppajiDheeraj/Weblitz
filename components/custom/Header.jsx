import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import Colors from "@/data/Colors";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useContext } from "react";
import { Download, Rocket } from "lucide-react";
import { useSidebar } from "../ui/sidebar";
import { ActionContext } from "@/context/ActionContext";

function Header() {
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const { action, setAction } = useContext(ActionContext);
  const { toggleSidebar } = useSidebar();

  const onActionBtn = (action) => {
    setAction({
      actionType: action,
      timestamp: Date.now(),
    })
  }

  return (
    <div className="p-4 flex justify-between items-center">
      <Link href={"/"}>
        <Image src={"/logo.png"} alt="logo" width={40} height={40} />
      </Link>
      {!userDetails?.name ? (
        <div className="flex gap-5">
          <Button variant="ghost">Sign In</Button>
          <Button
            className="text-white"
            style={{
              backgroundColor: Colors.BLUE,
            }}
          >
            Get Started
          </Button>
        </div>
      ) : (
        <div className="flex gap-5 items-center">
          {
            <>
              <Button variant="ghost" onClick={() => onActionBtn("export")}>
                <Download /> Export
              </Button>
              <Button
                onClick={() => onActionBtn("deploy")}
                className="text-white"
                style={{
                  backgroundColor: Colors.BLUE,
                }}
              >
                <Rocket /> Deploy
              </Button>
            </>
          }
          {userDetails && (
            <Image
              onClick={toggleSidebar}
              src={userDetails?.picture}
              alt="userImage"
              width={40}
              height={40}
              className="rounded-full cursor-pointer object-cover"
            />
          )}
        </div>
      )}
    </div>
  );
}

export default Header;