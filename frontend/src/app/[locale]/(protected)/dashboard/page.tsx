"use client";
import { useEffect, useState } from "react";
import ApplicationDisplay from "@/components/organisms/applicationsDisplay";
import { ApplicationType } from "@/types/applicationType";
import ApplicationFormModal from "@/components/organisms/applicationFormModal";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [showAppModal, setShowAppModal] = useState<boolean>(false);
  const [appData, setAppData] = useState({
    url: "",
    title: "",
    description: "",
    location: "",
    company: "",
    applied: true,
  });

  const [applications, setApplications] = useState<ApplicationType[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    page_size: 10,
    total_pages: 1,
    total_items: 0,
  });

  const handleAppChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAppData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAppSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        "/application",
        {
          ...appData,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        fetchApplications();
        toast.success("Application successfully created !");
      }
    } catch (error) {
      toast.error("An error appear during application creation");
      console.log(error);
    }
    setShowAppModal(false);
  };
  const fetchApplications = async (page = 1, pageSize = 10) => {
    try {
      console.log("OFFSET", (page - 1) * pageSize);
      const response = await axiosInstance.get("/applications-by-user", {
        params: {
          limit: pageSize,
          offset: (page - 1) * pageSize,
          title: "",
          status: "",
          orderByCreatedAt: "asc",
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        setApplications(response.data.datas);
        setPagination({
          current_page: page,
          page_size: pageSize,
          total_pages: response.data.pagination.total_pages,
          total_items: response.data.pagination.total_items,
        });
      }
      console.log("PAGE", pagination);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchApplications();
  }, []);
  return (
    <div className="flex min-h-screen">
      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <header className="flex items-center justify-between mb-8">
          <div>
            {/* Button to trigger application modal */}
            <button
              className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 ml-4"
              onClick={() => setShowAppModal(true)}
            >
              Create Application
            </button>
          </div>
        </header>

        {/* Main content here */}
        <div className="text-xl">Welcome to the Dashboard!</div>
        <ApplicationDisplay
          applications={applications}
          pagination={pagination}
          onPageChange={fetchApplications}
        />
      </div>

      {/* Modal for creating an application */}
      <ApplicationFormModal
        showModal={showAppModal}
        onClose={() => setShowAppModal(false)}
        onSubmit={handleAppSubmit}
        appData={appData}
        onChange={handleAppChange}
      />
    </div>
  );
}
