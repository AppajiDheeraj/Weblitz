import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import Lookup from "@/data/Lookup";
import { Button } from "@/components/ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useContext } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useMutation } from "convex/react";
import {api} from "@/convex/_generated/api";
import uuid4 from "uuid4";

function SignInDialog({ openDialog, closeDialog }) {
  const CreateUser = useMutation(api.users.CreateUser);
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: "Bearer " + tokenResponse?.access_token } }
      );

      console.log(userInfo);
      const user = userInfo.data;
      await CreateUser({
        name: user?.name,
        email: user?.email,
        picture: user?.picture,
        uid: uuid4(), // Generate a unique ID for the user
        token: 50000, // default token value (e.g., credits)
      });

      if(typeof window !== 'undefined') {
        localStorage.setItem("user", JSON.stringify(user));
      }

      setUserDetails(userInfo?.data);
      closeDialog(false);
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  return (
    <Dialog open={openDialog} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{Lookup.SIGNIN_HEADING}</DialogTitle>
          <div className="flex flex-col justify-center items-center gap-3">
            <h2 className="font-bold text-2xl text-center text-white">
              {Lookup.SIGNIN_HEADING}
            </h2>
            <p className="mt-2 text-center">{Lookup.SIGNIN_SUBHEADING}</p>
            <Button
              className="bg-blue-500 text-white hover:bg-blue-400 mt-3"
              onClick={() => googleLogin()}
            >
              Sign In With Google
            </Button>
            <p>{Lookup.SIGNIN_AGREEMENT_TEXT}</p>
          </div>
          <DialogDescription id="dialog-description">
            {Lookup.SIGNIN_SUBHEADING} {/* Inline content for accessibility */}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default SignInDialog;
