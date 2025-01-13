"use client";
import React from "react";

interface ApplicationModalProps {
  showModal: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  appData: {
    url: string;
    title: string;
    description: string;
    location: string;
    company: string;
    salary: string;
    applied: boolean;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export default function ApplicationFormModal({
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
        <h2 className="text-xl font-semibold mb-4">Create Application</h2>
        <form onSubmit={onSubmit} noValidate>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              URL<span className="text-red-600"> *</span>
            </label>
            <input
              type="url"
              name="url"
              value={appData.url}
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
              name="title"
              value={appData.title}
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
              name="description"
              value={appData.description}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={appData.location}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Company</label>
            <input
              type="text"
              name="company"
              value={appData.company}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Salary</label>
            <input
              type="text"
              name="salary"
              value={appData.salary}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Applied</label>
            <div className="flex items-center gap-4">
              <label>
                <input
                  type="radio"
                  name="applied"
                  value="true"
                  checked={appData.applied}
                  onChange={onChange}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="applied"
                  value="false"
                  checked={!appData.applied}
                  onChange={onChange}
                />
                No
              </label>
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
