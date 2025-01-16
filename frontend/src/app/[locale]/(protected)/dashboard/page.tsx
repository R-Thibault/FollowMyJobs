"use client";
import { useEffect, useState } from "react";
import ApplicationFormModal from "@/components/organisms/applicationFormModal";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/organisms/Navbar";
import { DataTable } from "@/components/organisms/data-table";
import { columns } from "@/components/organisms/columns";

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

  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    page_size: 10,
    total_pages: 1,
    total_items: 0,
  });
  const [titleSearch, setTitleSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("updated_at");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [statusFilter, setStatusFilterParam] = useState<string[]>([
    "1",
    "2",
    "3",
    "4",
  ]);

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
    titleSearchParam = titleSearch,
    statusFilterParam = statusFilter
  ) => {
    try {
      const response = await axiosInstance.get("/applications-by-user", {
        params: {
          limit: pageSize,
          offset: (page - 1) * pageSize,
          titleSearch: titleSearchParam.toLowerCase(),
          statusFilter: statusFilterParam.join(","),
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
        setStatusFilterParam(response.data.status);
      }
    } catch (error) {
      console.error("Error fetching applications", error);
    }
  };
  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateStatus = async (
    statusID: string,
    applicationID: string
  ) => {
    console.log(statusID);
    console.log(applicationID);
    try {
      const response = await axiosInstance.post(
        `/application/${applicationID}/status`,
        { applicationID: Number(applicationID), statusID: Number(statusID) },
        { withCredentials: true }
      );
      if (response.status === 200) {
        fetchApplications(
          pagination.current_page,
          pagination.page_size,
          sortBy,
          sortOrder,
          titleSearch,
          statusFilter
        );
        toast.success("Status updated successfully!");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="grow min-h-screen p-4 flex flex-col">
      <Navbar />
      <div className="flex md:flex-col p-6 mt-14">
        <div>
          <div className="flex gap-10 items-center">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <Button onClick={() => setShowAppModal(true)}>
              Create Application
            </Button>
          </div>
          <div className="flex md:flex-col items-center justify-center">
            <DataTable
              columns={columns({
                onSortChange: (sortBy, sortOrder) => {
                  setSortBy(sortBy);
                  setSortOrder(sortOrder);
                  fetchApplications(
                    1,
                    pagination.page_size,
                    sortBy,
                    sortOrder,
                    titleSearch,
                    statusFilter
                  );
                },
                setSelectedStatus(status, applicationID) {
                  handleUpdateStatus(status, applicationID);
                },
                currentSortBy: sortBy,
                currentSortOrder: sortOrder,
              })}
              data={applications}
              pagination={pagination}
              onPageChange={(page, pageSize) =>
                fetchApplications(
                  page,
                  pageSize,
                  sortBy,
                  sortOrder,
                  titleSearch,
                  statusFilter
                )
              }
              onSortChange={(sortBy, sortOrder) => {
                setSortBy(sortBy);
                setSortOrder(sortOrder);
                fetchApplications(
                  1,
                  pagination.page_size,
                  sortBy,
                  sortOrder,
                  titleSearch,
                  statusFilter
                );
              }}
              currentSortOrder={sortOrder}
              onSearchTitle={(titleSearchParam) => {
                setTitleSearch(titleSearchParam);
                fetchApplications(
                  1,
                  pagination.page_size,
                  sortBy,
                  sortOrder,
                  titleSearchParam,
                  statusFilter
                );
              }}
              titleSearchParam={titleSearch}
              statusFilterParam={statusFilter}
              onStatusFilterChange={(statusFilter) => {
                setStatusFilterParam(statusFilter);
                fetchApplications(
                  1,
                  pagination.page_size,
                  sortBy,
                  sortOrder,
                  titleSearch,
                  statusFilter
                );
              }}
              setSelectedStatus={(status, applicationID) => {
                handleUpdateStatus(status, applicationID);
              }}
            />
          </div>
        </div>
      </div>
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
