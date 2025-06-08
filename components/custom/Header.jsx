import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import Colors from "@/data/Colors";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useContext } from "react";
import { Download, Rocket } from "lucide-react";
import { useSidebar } from "../ui/sidebar";
import { ActionContext } from "@/context/ActionContext";
import SignInDialog from "./SignInDialog";

function Header() {
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const { action, setAction } = useContext(ActionContext);
  const { toggleSidebar } = useSidebar();
  const [ openDialog, setOpenDialog ] = useState(false);

  const onActionBtn = (action) => {
    setAction({
      actionType: action,
      timestamp: Date.now(),
    });
  };

  return (
    <div className="p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Link href={"/"}>
          <Image src={"/logo.png"} alt="logo" width={35} height={35} />
        </Link>
        <h2 className="font-bold text-xl">Weblitz</h2>
      </div>
      {!userDetails?.name ? (
        <div className="flex gap-5">
          <Button variant="ghost" onClick={() => setOpenDialog(true)}>Sign In</Button>
          <Button
            className="text-white"
            style={{
              backgroundColor: Colors.BLUE,
            }}
            onClick={() => setOpenDialog(true)}
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
            <SignInDialog openDialog={openDialog} closeDialog={(v) => setOpenDialog(v)} />
    </div>
  );
}

export default Header;
