"use client";

import { ApplicationType } from "@/types/applicationType";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ExternalLink, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusType } from "@/types/statusType";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

export const columns = ({
  onSortChange,
  currentSortBy,
  currentSortOrder,
  setSelectedStatus,
  setUpdateApplicationModal,
  setDeleteApplicationModal,
  locale,
}: {
  onSortChange: (sortBy: string, sortOrder: string) => void;
  currentSortBy: string;
  currentSortOrder: string;
  setSelectedStatus: (status: number, applicationID: number) => void;
  setUpdateApplicationModal: (applicationData: ApplicationType) => void;
  setDeleteApplicationModal: (applicationData: ApplicationType) => void;
  locale: string;
}): ColumnDef<ApplicationType>[] => [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "Status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("Status") as StatusType;
      const applicationID = row.original.ID;

      return (
        <Select
          onValueChange={(value) => {
            (row.getValue("Status") as StatusType).Status = value;
            setSelectedStatus(Number(value), applicationID);
          }}
          defaultValue={status.ID.toString()}
        >
          <SelectTrigger>
            <SelectValue placeholder={status.Status} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Applied</SelectItem>
            <SelectItem value="2">FollowedUp</SelectItem>
            <SelectItem value="3">Rejected</SelectItem>
            <SelectItem value="4">Closed</SelectItem>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "Url",
    header: () => (
      <Button
        variant="ghost"
        onClick={() =>
          onSortChange("Url", currentSortOrder === "asc" ? "desc" : "asc")
        }
      >
        Website
        {currentSortBy === "Url" ? (
          currentSortOrder === "asc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUp className="ml-2 h-4 w-4" />
          )
        ) : (
          <span className="ml-2">-</span>
        )}
      </Button>
    ),
    enableSorting: true,
    cell: ({ row }) => {
      const url = row.getValue("Url") as string;
      const websiteName = new URL(url).hostname.replace("www.", "");
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-600 hover:underline"
        >
          {websiteName}
          <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      );
    },
  },
  {
    accessorKey: "Location",
    header: () => (
      <Button
        variant="ghost"
        onClick={() =>
          onSortChange("Location", currentSortOrder === "asc" ? "desc" : "asc")
        }
      >
        Location
        {currentSortBy === "Location" ? (
          currentSortOrder === "asc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUp className="ml-2 h-4 w-4" />
          )
        ) : (
          <span className="ml-2">-</span>
        )}
      </Button>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "Title",
    header: () => (
      <Button
        variant="ghost"
        onClick={() =>
          onSortChange("Title", currentSortOrder === "asc" ? "desc" : "asc")
        }
      >
        Title
        {currentSortBy === "Title" ? (
          currentSortOrder === "asc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUp className="ml-2 h-4 w-4" />
          )
        ) : (
          <span className="ml-2">-</span>
        )}
      </Button>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "Salary",
    header: () => (
      <Button
        variant="ghost"
        onClick={() =>
          onSortChange("Salary", currentSortOrder === "asc" ? "desc" : "asc")
        }
      >
        Salary
        {currentSortBy === "Salary" ? (
          currentSortOrder === "asc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUp className="ml-2 h-4 w-4" />
          )
        ) : (
          <span className="ml-2">-</span>
        )}
      </Button>
    ),
    enableSorting: true,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("Salary"));
      return (
        <div className="text-center font-medium">
          {new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
          }).format(amount)}
        </div>
      );
    },
  },
  {
    accessorKey: "UpdatedAt",
    header: () => (
      <Button
        variant="ghost"
        onClick={() =>
          onSortChange("UpdatedAt", currentSortOrder === "asc" ? "desc" : "asc")
        }
      >
        Last update
        {currentSortBy === "UpdatedAt" ? (
          currentSortOrder === "asc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUp className="ml-2 h-4 w-4" />
          )
        ) : (
          <span className="ml-2">-</span>
        )}
      </Button>
    ),
    enableSorting: true,
    cell: ({ row }) => {
      const date = row.getValue("UpdatedAt") as string;
      return (
        <div className="text-center font-medium">
          {new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setUpdateApplicationModal(row.original);
                }}
              >
                Update Application
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/${locale}/application/${row.original.ID}`}>
                  View application details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setDeleteApplicationModal(row.original);
                }}
              >
                Delete application
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
