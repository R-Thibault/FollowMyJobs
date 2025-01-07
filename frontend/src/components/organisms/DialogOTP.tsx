"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Input } from "../ui/input";
import { OTPCheckType } from "@/types/OTPTypes";
import { Button } from "../ui/button";

export default function DialogOTP(props: OTPCheckType) {
  const [errorOTPMessage, setErrorOTPMessage] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<boolean>(false);
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const t = useTranslations("OTPDialog");
  const locale = useLocale();
  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const otpResponse = await axiosInstance.post("/verify-otp", {
        email: props.email,
        otpCode: otp,
      });
      if (otpResponse.data) {
        setErrorOTPMessage(false);
        setSuccessMessage(true);
        setTimeout(() => {
          router.push(`/${locale}/login`);
        }, 3000);
      } else {
        setErrorOTPMessage(true);
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      setErrorOTPMessage(true);
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-md shadow-lg">
        <h3 className="text-xl font-bold text-center yb-4">{t("title")}</h3>

        {successMessage ? (
          <div className="flex items-center justify-center my-4">
            <p>{t("successMessage")}</p>
          </div>
        ) : (
          <>
            <p className="my-4">{t("description")}</p>
            <form onSubmit={handleOtpSubmit}>
              <Input
                className="hidden"
                type="email"
                id="email"
                value={props.email}
              ></Input>
              <div className="flex flex-col items-center justify-center my-8">
                <Label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700 my-2"
                >
                  {t("OTP")}
                </Label>
                <Input
                  type="number"
                  id="opt"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                  }}
                  className="w-48  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                ></Input>
              </div>
              {errorOTPMessage && (
                <p className="text-red-500 text-sm mb-4">{errorOTPMessage}</p>
              )}
              <Button
                type="submit"
                className="w-full px-4 py-2 mt-4 text-white  rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {t("OTPButton")}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
