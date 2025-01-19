"use client";

import React from "react";
import { Button } from "../ui/button";

interface ApplicationModalProps {
  showModal: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  appTitle?: string;
}

export default function DeleteApplicationFormModal({
  showModal,
  onClose,
  onSubmit,
  appTitle,
}: ApplicationModalProps) {
  if (!showModal) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative bg-white p-6 rounded-md shadow-md w-96">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <div>
          <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
          <p className="text-sm text-gray-600 mb-6">
            Are you sure you want to delete the application{" "}
            {appTitle ? `"${appTitle}"` : ""}? This action cannot be undone.
          </p>
          <form onSubmit={onSubmit}>
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                onClick={onClose}
                className="bg-gray-300 text-black"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-red-600 text-white">
                Confirm
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
