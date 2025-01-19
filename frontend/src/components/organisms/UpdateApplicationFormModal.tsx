"use client";
import { ApplicationType } from "@/types/applicationType";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ApplicationModalProps {
  showModal: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  appData: ApplicationType;
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      | { name: string; value: any }
  ) => void;
}

export default function UpdateApplicationFormModal({
  showModal,
  onClose,
  onSubmit,
  appData,
  onChange,
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
        <h2 className="text-xl font-semibold mb-4">Update Application</h2>
        <form onSubmit={onSubmit} noValidate>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              URL<span className="text-red-600"> *</span>
            </label>
            <input
              type="url"
              name="Url"
              value={appData.Url}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Title<span className="text-red-600"> *</span>
            </label>
            <input
              type="text"
              name="Title"
              value={appData.Title}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="Description"
              value={appData.Description}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              name="Location"
              value={appData.Location}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Company</label>
            <input
              type="text"
              name="Company"
              value={appData.Company}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Salary</label>
            <input
              type="number"
              name="Salary"
              value={appData.Salary}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Applied</label>
            <div className="flex items-center gap-4">
              <Select
                onValueChange={(value) =>
                  onChange({
                    name: "Status",
                    value: {
                      ID: Number(value),
                      Status:
                        value === "1"
                          ? "Applied"
                          : value === "2"
                          ? "FollowedUp"
                          : value === "3"
                          ? "Rejected"
                          : "Closed",
                    },
                  })
                }
                defaultValue={appData.Status.ID.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder={appData.Status.Status} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Applied</SelectItem>
                  <SelectItem value="2">FollowedUp</SelectItem>
                  <SelectItem value="3">Rejected</SelectItem>
                  <SelectItem value="4">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="bg-gray-300 text-black px-4 py-2 rounded-md mr-2 hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
