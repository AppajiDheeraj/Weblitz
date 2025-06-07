import Colors from "@/data/Colors";
import Lookup from "@/data/Lookup";
import React, { useContext, useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

function PricingModel() {
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const [selectedOption, setSelectedOption] = useState();
  const updateTokens = useMutation(api.users.UpdateToken);
  const onPaymentSuccess = async (option) => {
    const token = userDetails?.token + Number(selectedOption?.value);
    console.log("Token after update:", token);
    await updateTokens({
      token: token,
      userId: userDetails?._id,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
      {Lookup.PRICING_OPTIONS.map((option, index) => (
        <div
          className="p-7 border rounded-xl flex flex-col items-center justify-center text-white w-full"
          onClick={() => setSelectedOption(option)}
          style={{
            backgroundColor: Colors.BACKGROUND,
          }}
          key={index}
        >
          <h2 className="font-bold text-2xl">{option.name}</h2>
          <h2 className="font-medium text-lg">{option.tokens}</h2>
          <p className="text-gray-400 text-center">{option.desc}</p>
          <h2 className="font-bold text-4xl text-center mt-6 mb-6">
            ${option.price}
          </h2>
          <PayPalButtons
            disabled={!userDetails?.email}
            style={{
              layout: "horizontal",
            }}
            onApprove={() => onPaymentSuccess(option)}
            onCancel={() => {
              console.log("Payment cancelled");
            }}
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: option.price,
                      currency_code: "USD",
                    },
                  },
                ],
              });
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default PricingModel;
