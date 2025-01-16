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

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface DataTableProps<TData, TValue> {
  columns:
    | ColumnDef<TData, TValue>[]
    | ((props: {
        onSortChange: (sortBy: string, sortOrder: string) => void;
        setSelectedStatus: (status: string, applicationID: string) => void;
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
  setSelectedStatus: (status: string, applicationID: string) => void;
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
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [searchValue, setSearchValue] =
    React.useState<string>(titleSearchParam);

  const columnDefs = Array.isArray(columns)
    ? columns
    : columns({ onSortChange, setSelectedStatus });
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
    <div className="flex flex-col lg:flex-row">
      <div className="flex flex-col  w-full lg:w-1/4 p-4">
        <Input
          placeholder="Filter title..."
          value={searchValue}
          onChange={(event) => {
            setSearchValue(event.target.value);
            onSearchTitle(event.target.value);
          }}
          className="mb-4"
        />

        <label className="text-sm font-medium">Filter by status:</label>
        <div className="flex flex-row lg:flex-col gap-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="Applied"
              checked={statusFilterParam.includes("1")}
              onCheckedChange={(checked) =>
                onStatusFilterChange(
                  checked
                    ? [...statusFilterParam, "1"]
                    : statusFilterParam.filter((val) => val !== "1")
                )
              }
            />
            <label htmlFor="Applied">Applied</label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="FollowedUp"
              checked={statusFilterParam.includes("2")}
              onCheckedChange={(checked) =>
                onStatusFilterChange(
                  checked
                    ? [...statusFilterParam, "2"]
                    : statusFilterParam.filter((val) => val !== "2")
                )
              }
            />
            <label htmlFor="FollowedUp">Followed Up</label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id={"Rejected"}
              checked={statusFilterParam.includes("3")}
              onCheckedChange={(checked) =>
                onStatusFilterChange(
                  checked
                    ? [...statusFilterParam, "3"]
                    : statusFilterParam.filter((val) => val !== "3")
                )
              }
            />
            <label htmlFor="Rejected">Rejected</label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="Closed"
              checked={statusFilterParam.includes("4")}
              onCheckedChange={(checked) =>
                onStatusFilterChange(
                  checked
                    ? [...statusFilterParam, "4"]
                    : statusFilterParam.filter((val) => val !== "4")
                )
              }
            />
            <label htmlFor="Closed">Closed</label>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="mt-4">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1 p-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
                    <TableCell key={cell.id}>
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
        <div className="flex items-center justify-between mt-4">
          <Button
            className="m-2"
            variant="outline"
            onClick={() =>
              onPageChange(pagination.current_page - 1, pagination.page_size)
            }
            disabled={pagination.current_page <= 1}
          >
            Previous
          </Button>
          <p>
            Page {pagination.current_page} of {pagination.total_pages}
          </p>
          <Button
            className="m-2"
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
