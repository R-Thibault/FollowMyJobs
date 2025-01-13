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
  onSortChange: (sortBy: string, sortOrder: string) => void;
  currentSortBy: string;
  currentSortOrder: string;
  onSearchTitle: (titleSearchParam: string) => void;
  titleSearchParam: string;
}

export default function ApplicationDisplay({
  applications,
  pagination,
  onPageChange,
  onSortChange,
  currentSortBy,
  currentSortOrder,
  onSearchTitle,
  titleSearchParam,
}: ApplicationDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <DataTable
        columns={columns({ onSortChange, currentSortBy, currentSortOrder })}
        data={applications}
        pagination={pagination}
        onPageChange={onPageChange}
        onSortChange={onSortChange}
        currentSortBy={currentSortBy}
        currentSortOrder={currentSortOrder}
        onSearchTitle={onSearchTitle}
        titleSearchParam={titleSearchParam}
      />
    </div>
  );
}
