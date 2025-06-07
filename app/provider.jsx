"use client";
// This file is used to wrap the application with a context provider

import React, { useEffect } from "react";
import Headers from "@/components/custom/Header";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { MessagesContext } from "@/context/MessagesContext";
import { useState } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ConvexClientProvider from "./ConvexClientProvider";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSideBar from "@/components/custom/AppSideBar";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { ActionContext } from "@/context/ActionContext";
import { useRouter } from "next/navigation";

function Provider({ children }) {
  const [messages, setMessages] = useState([]);
  const [userDetails, setUserDetails] = useState();
  const [ action, setAction ] = useState();
  const router = useRouter();
  const convex = useConvex();

  useEffect(() => {
    // Check if user is authenticated on initial load
    isAuthenticated();
  }, []);

  const isAuthenticated = async () => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user"));
      //Fetch user details from Convex if user exists
      if (!user) {
        router.push("/")
        return;
      }
      const result = await convex.query(api.users.GetUser, {
        email: user?.email,
      });
      setUserDetails(result);
      console.log("User Details:", result);
    }
  };
  return (
    <div>
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY}
      >
        <PayPalScriptProvider
          options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}
        >
          <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
            <MessagesContext.Provider value={{ messages, setMessages }}>
              <ActionContext.Provider value={{ action, setAction }}>
                <NextThemesProvider
                  attribute="class"
                  defaultTheme="dark"
                  enableSystem
                  disableTransitionOnChange
                >
                  <SidebarProvider defaultOpen={false}>
                    <AppSideBar />
                    <main className="w-full">
                      <Headers />

                      {children}
                    </main>
                  </SidebarProvider>
                </NextThemesProvider>
              </ActionContext.Provider>
            </MessagesContext.Provider>
          </UserDetailContext.Provider>
        </PayPalScriptProvider>
      </GoogleOAuthProvider>
    </div>
  );
}

export default Provider;
