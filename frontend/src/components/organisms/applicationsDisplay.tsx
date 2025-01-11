"use client";
import { ApplicationType } from "@/types/applicationType";

import { DataTable } from "./data-table";
import { columns } from "./columns";

interface ApplicationDisplayProps {
  applications: ApplicationType[];
  pagination: {
    current_page: number;
    page_size: number;
    total_pages: number;
    total_items: number;
  };
  onPageChange: (page: number, pageSize: number) => void;
}

export default function ApplicationDisplay({
  applications,
  pagination,
  onPageChange,
}: ApplicationDisplayProps) {
  console.log("APPS", applications);
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <DataTable
        columns={columns}
        data={applications}
        pagination={pagination}
        onPageChange={onPageChange}
      />
    </div>
  );
}
