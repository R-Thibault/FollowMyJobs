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

interface DataTableProps<TData, TValue> {
  columns:
    | ColumnDef<TData, TValue>[]
    | ((props: {
        onSortChange: (sortBy: string, sortOrder: string) => void;
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
  currentSortBy: string;
  currentSortOrder: string;
  onSearchTitle: (titleSearchParam: string) => void;
  titleSearchParam: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  onPageChange,
  onSortChange,
  currentSortBy,
  currentSortOrder,
  onSearchTitle,
  titleSearchParam,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [searchValue, setSearchValue] = React.useState<string>("");
  const columnDefs = Array.isArray(columns)
    ? columns
    : columns({ onSortChange });
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
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter title..."
          value={searchValue}
          onChange={(event) => {
            onSearchTitle(event.target.value);
            // table.getColumn("Title")?.setFilterValue(event.target.value);
            setSearchValue(event.target.value);
          }}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.column.columnDef.enableSorting ? (
                      <button
                        onClick={() =>
                          onSortChange(
                            header.column.id,
                            currentSortOrder === "asc" ? "desc" : "asc"
                          )
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </button>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
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
              // {data.length > 0 ? (
              //   data.map((row, index) => (
              //     <TableRow key={index}>
              //       {columnDefs.map((col) => (
              //         <TableCell key={col.id as string}>
              //           {flexRender(col.cell as any, row)}
              //         </TableCell>
              //       ))}
              //     </TableRow>
              //   ))
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
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
