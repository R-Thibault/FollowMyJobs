"use client";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ApplicationType } from "@/types/applicationType";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLocale } from "next-intl";

interface DataTableProps<TData, TValue> {
  columns:
    | ColumnDef<TData, TValue>[]
    | ((props: {
        onSortChange: (sortBy: string, sortOrder: string) => void;
        setSelectedStatus: (status: number, applicationID: number) => void;
        setUpdateApplicationModal: (applicationDatas: ApplicationType) => void;
        setDeleteApplicationModal: (applicationDatas: ApplicationType) => void;
        locale: string;
      }) => ColumnDef<TData, TValue>[]);

  data: TData[];

  pagination: {
    current_page: number;
    page_size: number;
    total_pages: number;
    total_items: number;
  };
  onPageChange: (page: number, pageSize: number) => void;
  onSortChange: (sortBy: string, sortOrder: string) => void;
  currentSortOrder: string;
  onSearchTitle: (titleSearchParam: string) => void;
  titleSearchParam: string;
  statusFilterParam: string[];
  onStatusFilterChange: (statusFilterParam: string[]) => void;
  setSelectedStatus: (status: number, applicationID: number) => void;
  setUpdateApplicationModal: (applicationDatas: ApplicationType) => void;
  setDeleteApplicationModal: (applicationDatas: ApplicationType) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  onPageChange,
  onSortChange,
  onSearchTitle,
  titleSearchParam,
  statusFilterParam,
  onStatusFilterChange,
  setSelectedStatus,
  setUpdateApplicationModal,
  setDeleteApplicationModal,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const locale = useLocale();
  const [searchValue, setSearchValue] =
    React.useState<string>(titleSearchParam);
  const [filtersOpen, setFiltersOpen] = React.useState<boolean>(false); // Mobile filter toggle
  const columnDefs = Array.isArray(columns)
    ? columns
    : columns({
        onSortChange,
        setSelectedStatus,
        setUpdateApplicationModal,
        setDeleteApplicationModal,
        locale: locale,
      });

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns: columnDefs,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="flex flex-col w-full p-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <Input
          placeholder="Search title..."
          value={searchValue}
          onChange={(event) => {
            setSearchValue(event.target.value);
            onSearchTitle(event.target.value);
          }}
          className="w-full sm:w-1/2"
        />

        <Button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="mt-2 sm:mt-0 sm:ml-4 flex items-center"
          variant="outline"
        >
          Filters{" "}
          {filtersOpen ? (
            <ChevronUp className="ml-2" />
          ) : (
            <ChevronDown className="ml-2" />
          )}
        </Button>
      </div>

      {/* Smooth Dropdown Filter Section */}
      {filtersOpen && (
        <div className="bg-gray-100 rounded-lg p-4 mb-4 shadow-sm transition-all">
          <label className="text-sm font-medium mb-2 block">
            Filter by Status:
          </label>
          <div className="flex flex-wrap gap-3">
            {[
              { id: "1", label: "Applied" },
              { id: "2", label: "Followed Up" },
              { id: "3", label: "Rejected" },
              { id: "4", label: "Closed" },
            ].map(({ id, label }) => (
              <div key={id} className="flex items-center gap-2">
                <Checkbox
                  id={id}
                  checked={statusFilterParam.includes(id)}
                  onCheckedChange={(checked) =>
                    onStatusFilterChange(
                      checked
                        ? [...statusFilterParam, id]
                        : statusFilterParam.filter((val) => val !== id)
                    )
                  }
                />
                <label htmlFor={id} className="text-sm">
                  {label}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="flex-auto p-4 overflow-x-auto">
        <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
          <Table className="min-w-full">
            <TableHeader className="bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="px-3 py-2 text-left">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-3 py-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-4">
          <Button
            variant="outline"
            onClick={() =>
              onPageChange(pagination.current_page - 1, pagination.page_size)
            }
            disabled={pagination.current_page <= 1}
          >
            Previous
          </Button>
          <p className="my-2 sm:my-0">
            Page {pagination.current_page} of {pagination.total_pages}
          </p>
          <Button
            variant="outline"
            onClick={() =>
              onPageChange(pagination.current_page + 1, pagination.page_size)
            }
            disabled={pagination.current_page >= pagination.total_pages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
