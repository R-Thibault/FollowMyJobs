"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/organisms/Navbar";
import { DataTable } from "@/components/organisms/data-table";
import { columns } from "@/components/organisms/columns";
import { ApplicationType } from "@/types/applicationType";
import CreateApplicationFormModal from "@/components/organisms/CreateApplicationFormModal";
import UpdateApplicationFormModal from "@/components/organisms/UpdateApplicationFormModal";
import DeleteApplicationFormModal from "@/components/organisms/DeleteApplicationFormModal";

export default function Dashboard() {
  const [showAppCreateModal, setShowAppCreateModal] = useState<boolean>(false);
  const [showAppUpdateModal, setShowAppUpdateModal] = useState<boolean>(false);
  const [showDeleteConfirmation, setShowAppDeleteModal] =
    useState<boolean>(false);
  const [appData, setAppData] = useState<ApplicationType>({
    ID: 0,
    Url: "",
    Title: "",
    Description: "",
    Location: "",
    Company: "",
    Salary: 0,
    Status: {
      ID: 1,
      Status: "Applied",
    },
  });
  const [appUpdateData, setAppUpdateData] = useState<ApplicationType>({
    ID: 0,
    Url: "",
    Title: "",
    Description: "",
    Location: "",
    Company: "",
    Salary: 0,
    Status: {
      ID: 1,
      Status: "Applied",
    },
  });
  const [appDeleteData, setAppDeleteData] = useState<ApplicationType>({
    ID: 0,
    Url: "",
    Title: "",
    Description: "",
    Location: "",
    Company: "",
    Salary: 0,
    Status: {
      ID: 1,
      Status: "Applied",
    },
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

  const handleCreateAppChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      | { name: string; value: any }
  ) => {
    if ("target" in e) {
      const { name, value } = e.target;
      setAppData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      // Handling select dropdown change
      setAppData((prevData) => ({
        ...prevData,
        [e.name]: e.value,
      }));
    }
  };

  const handleUpdateAppChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      | { name: string; value: any }
  ) => {
    if ("target" in e) {
      const { name, value } = e.target;
      setAppUpdateData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      // Handling select dropdown change
      setAppUpdateData((prevData) => ({
        ...prevData,
        [e.name]: e.value,
      }));
    }
  };

  const handleCreateAppSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    setShowAppCreateModal(false);
  };

  const handleUpdateAppSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        "/update-application",
        appUpdateData,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        fetchApplications();
        toast.success("Application successfully created!");
      }
    } catch {
      toast.error("An error occurred during application creation");
    }
    setShowAppCreateModal(false);
  };
  const handleDeleteAppSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(appDeleteData);
    try {
      const response = await axiosInstance.post(
        "/delete-application",
        appDeleteData,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        fetchApplications();
        toast.success("Application successfully deleted!");
      }
    } catch {
      toast.error("An error occurred during application supression");
    }
    setShowAppDeleteModal(false);
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
    statusID: number,
    applicationID: number
  ) => {
    console.log(statusID);
    console.log(applicationID);
    try {
      const response = await axiosInstance.post(
        `/application/${applicationID}/status`,
        { applicationID: applicationID, statusID: statusID },
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
      <div className="flex lg:flex-col p-6 mt-14">
        <div>
          <div className="flex gap-10 items-center">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <Button onClick={() => setShowAppCreateModal(true)}>
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
                setUpdateApplicationModal: (datas: ApplicationType) => {
                  setAppUpdateData(datas);
                  setShowAppUpdateModal(true);
                },
                setDeleteApplicationModal: (datas: ApplicationType) => {
                  setAppDeleteData(datas);
                  setShowAppDeleteModal(true);
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
              setUpdateApplicationModal={(datas: ApplicationType) => {
                setAppUpdateData(datas);
                setShowAppUpdateModal(true);
              }}
              setDeleteApplicationModal={(datas: ApplicationType) => {
                setAppDeleteData(datas);
                setShowAppDeleteModal(true);
              }}
            />
          </div>
        </div>
      </div>
      <CreateApplicationFormModal
        showModal={showAppCreateModal}
        onClose={() => setShowAppCreateModal(false)}
        onSubmit={handleCreateAppSubmit}
        appData={appData}
        onChange={handleCreateAppChange}
      />
      <UpdateApplicationFormModal
        showModal={showAppUpdateModal}
        onClose={() => setShowAppUpdateModal(false)}
        onSubmit={handleUpdateAppSubmit}
        appData={appUpdateData}
        onChange={handleUpdateAppChange}
      />
      <DeleteApplicationFormModal
        showModal={showDeleteConfirmation}
        onClose={() => setShowAppDeleteModal(false)}
        onSubmit={handleDeleteAppSubmit}
        appTitle={appDeleteData.Title}
      />
    </div>
  );
}
