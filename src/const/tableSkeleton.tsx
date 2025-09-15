import { Skeleton } from "@/Components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/Components/ui/table";

export default function SkeletonTable() {
  return (
    <div className="border-gray-100 border rounded-lg">
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead>
              <Skeleton className="h-3 w-[100px]" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-3 w-[100px]" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-3 w-[100px]" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-3 w-[100px]" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(10)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-5 w-[100px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[100px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[100px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[100px]" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}