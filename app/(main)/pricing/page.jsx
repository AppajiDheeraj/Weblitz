"use client";
import PricingModel from "@/components/custom/PricingModel";
import { UserDetailContext } from "@/context/UserDetailContext";
import Colors from "@/data/Colors";
import Lookup from "@/data/Lookup";
import React, { useContext } from "react";

function Pricing() {
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const token = userDetails?.token || 0;
  const tokenleft = (token / 1000).toFixed(1);

  return (
    <div className="mt-5 flex flex-col items-center w-full p-10 md:px-32 lg:px-48">
      <h2 className="font-bold text-5xl">Pricing</h2>
      <p className="text-gray-400 max-w-xl text-center mt-4">
        {Lookup.PRICING_DESC}
      </p>
      <div
        className="p-5 border rounded-xl flex flex-row justify-between w-full mt-4 items-center"
        style={{
          backgroundColor: Colors.BACKGROUND,
        }}
      >
        <h2 className="text-lg font-medium">
          <span className="font-bold">{tokenleft}</span> Token Left
        </h2>
        <div className="">
          <h2 className="font-medium">Need more token? </h2>
          <p>Upgrade your plan below </p>
        </div>
      </div>
      <PricingModel />
    </div>
  );
}

export default Pricing;
