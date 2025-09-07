import type { ColumnDef, SortingState } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Input } from "./ui/input";
import { ArrowDownNarrowWide, ArrowDownWideNarrow, ArrowUpNarrowWide, Search } from "lucide-react";
import { Button } from "./ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title?:string
}

export default function BidingComponent<TData, TValue>({
  columns,
  data,
  title
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4 ">
      {/* 🔍 Search + Sort Buttons */}
      <div className={`flex ${title ? 'justify-between  gap-4' :"justify-end"} items-center`}>

       {
        title &&  <p className="font-bold text-3xl whitespace-nowrap sm:text-2xl text-gray-600 border-l-4 border-gray-600 pl-3 tracking-tight">
          Your Bids
        </p>
       }
       <div className="flex items-center gap-4">
         {/* Search */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="border px-3 py-2 rounded-md w-64"
          />
          <Search className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-600" />
        </div>

        <Button
          variant={"secondary"}
          size={"icon"}
          className="cursor-pointer"
          onClick={() =>
            setSorting([{ id: "bid_to", desc: false }]) 
          }
        >
          <ArrowUpNarrowWide className="w-4 h-4 text-gray-600" />
        </Button>

        <Button
          variant={"secondary"}
          size={"icon"}
          className="cursor-pointer"
          onClick={() =>
            setSorting([{ id: "bid_to", desc: true }]) 
          }
        >
          <ArrowDownWideNarrow className="w-4 h-4 text-gray-600" />
        </Button>
       </div>
      </div>

      <div className="overflow-hidden rounded-md ">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-100 ">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="font-semibold text-gray-600"  >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
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
                  {row.getVisibleCells().map((cell) => {
                    return(
                      <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <div className="flex gap-2">
          <Button
         
            className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
