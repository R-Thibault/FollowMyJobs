"use client";
import { SetStateAction, useEffect, useState } from "react";
import ApplicationDisplay from "@/components/organisms/applicationsDisplay";
import { ApplicationType } from "@/types/applicationType";
import ApplicationFormModal from "@/components/organisms/applicationFormModal";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { title } from "process";

export default function Dashboard() {
  const [showAppModal, setShowAppModal] = useState<boolean>(false);
  const [appData, setAppData] = useState({
    url: "",
    title: "",
    description: "",
    location: "",
    company: "",
    salary: "",
    applied: true,
  });

  const [applications, setApplications] = useState<ApplicationType[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    page_size: 10,
    total_pages: 1,
    total_items: 0,
  });
  const [titleSearch, setTitleSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("updated_at");
  const [sortOrder, setSortOrder] = useState<string>("desc");
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
      const response = await axiosInstance.post("/application", appData, {
        withCredentials: true,
      });

      if (response.status === 200) {
        fetchApplications();
        toast.success("Application successfully created!");
      }
    } catch {
      toast.error("An error occurred during application creation");
    }
    setShowAppModal(false);
  };

  const fetchApplications = async (
    page = 1,
    pageSize = 10,
    sortByParam = sortBy,
    sortOrderParam = sortOrder,
    titleSearchParam = titleSearch
  ) => {
    try {
      const response = await axiosInstance.get("/applications-by-user", {
        params: {
          limit: pageSize,
          offset: (page - 1) * pageSize,
          titleSearch: titleSearchParam.toLowerCase(),
          sortBy: sortByParam.toLowerCase(),
          sortOrder: sortOrderParam,
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
    } catch (error) {
      console.error("Error fetching applications", error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <Button onClick={() => setShowAppModal(true)}>
              Create Application
            </Button>
          </CardHeader>
          <CardContent>
            <ApplicationDisplay
              applications={applications}
              pagination={pagination}
              onPageChange={fetchApplications}
              onSortChange={(sortBy, sortOrder) => {
                setSortBy(sortBy);
                setSortOrder(sortOrder);
                fetchApplications(
                  1,
                  pagination.page_size,
                  sortBy,
                  sortOrder,
                  titleSearch
                );
              }}
              currentSortBy={sortBy}
              currentSortOrder={sortOrder}
              onSearchTitle={(titleSearchParam) => {
                setTitleSearch(titleSearchParam);
                fetchApplications(
                  1,
                  pagination.page_size,
                  sortBy,
                  sortOrder,
                  titleSearchParam
                );
              }}
              titleSearchParam={titleSearch}
            />
          </CardContent>
        </Card>
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
