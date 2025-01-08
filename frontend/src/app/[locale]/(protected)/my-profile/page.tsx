"use client";

import axiosInstance from "@/lib/axiosInstance";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Edit3, Save, X } from "lucide-react";
import { useTranslations } from "next-intl";

export default function MyProfilePage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [userFirstName, setUserFirstName] = useState<string>("");
  const [userLastName, setUserLastName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [errorEmptyInput, setErrorEmptyInput] = useState<boolean>(false);
  const [successUpdateProfile, setSuccessUpdateProfile] =
    useState<boolean>(false);
  const [errorUpdateProfile, setErrorUpdateProfile] = useState<boolean>(false);
  const [successResetPassword, setSuccessResetPassword] =
    useState<boolean>(false);
  const [errorResetPassword, setErrorResetPassword] = useState<boolean>(false);
  const [errorLoading, setErrorLoading] = useState<boolean>(false);

  const t = useTranslations("profilePage");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/me", {
          withCredentials: true,
        });
        if (response.status === 200) {
          setUserLastName(response.data.userLastName);
          setUserFirstName(response.data.userFirstName);
          setUserEmail(response.data.userEmail);
        }
      } catch {
        setErrorLoading(true);
      } finally {
        setErrorLoading(false);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async () => {
    if (!userFirstName || !userLastName) {
      setErrorEmptyInput(true);
      return;
    }

    try {
      setSaving(true);
      const response = await axiosInstance.post(
        "/update-user-profile",
        {
          userLastName,
          userFirstName,
          email: userEmail,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setSuccessUpdateProfile(true);
        setErrorUpdateProfile(false);
        setIsEditing(false);
      }
    } catch {
      setSuccessUpdateProfile(false);
      setErrorUpdateProfile(true);
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/send-reset-password-link", {
        email: userEmail,
      });
      if (response.data) {
        setSuccessResetPassword(true);
        setErrorResetPassword(false);
      }
    } catch {
      setSuccessResetPassword(false);
      setErrorResetPassword(true);
    }
  };

  if (errorLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <div className="bg-white shadow-lg rounded-lg p-6 text-center max-w-sm w-full">
          <p className="text-red-500">{t("errorLoading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg space-y-6">
        {/* Profile Image and Header Section */}
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-2xl font-semibold text-center">
            {userFirstName} {userLastName}
          </h1>
          <p className="text-gray-500">{userEmail}</p>
        </div>

        {/* Loading State */}
        {loading ? (
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
        ) : isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("lastName")}
              </label>
              <Input
                type="text"
                value={userLastName}
                onChange={(e) => setUserLastName(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("firstName")}
              </label>
              <Input
                type="text"
                value={userFirstName}
                onChange={(e) => setUserFirstName(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("email")}
              </label>
              <Input
                value={userEmail}
                readOnly
                className="w-full p-2 border rounded-lg bg-gray-200"
              />
            </div>
            {errorEmptyInput && (
              <p className="text-red-500 mt-2">{t("errorEmptyInput")}</p>
            )}
          </div>
        ) : null}

        {/* Action Feedback Messages */}
        <div className="text-center space-y-2">
          {successResetPassword && (
            <p className="text-green-500">{t("successResetPassword")}</p>
          )}
          {successUpdateProfile && (
            <p className="text-green-500">{t("successUpdateProfile")}</p>
          )}
          {errorResetPassword && (
            <p className="text-red-500">{t("errorResetPassword")}</p>
          )}
          {errorUpdateProfile && (
            <p className="text-red-500">{t("errorUpdateProfile")}</p>
          )}
        </div>

        {/* Action Buttons Section */}
        <div className="flex flex-col gap-4">
          {isEditing ? (
            <>
              <Button
                onClick={handleSubmit}
                disabled={saving}
                className="w-full bg-green-500 hover:bg-green-600 flex items-center justify-center"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="mr-2" />
                )}
                {t("save")}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="w-full text-red-500 border-red-500 hover:bg-red-100 flex items-center justify-center"
              >
                <X className="mr-2" />
                {t("cancel")}
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => setIsEditing(true)}
                className="w-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center"
              >
                <Edit3 className="mr-2" />
                {t("updateInformations")}
              </Button>
              <Button
                onClick={handleResetPassword}
                className="w-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center"
              >
                <Edit3 className="mr-2" />
                {t("resetPassword")}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
