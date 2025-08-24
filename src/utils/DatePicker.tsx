"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "../Components/ui/button"
import { Calendar } from "../Components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../Components/ui/popover"

type Props={
  date?: Date
  setDate?: React.Dispatch<React.SetStateAction<Date | undefined>>
}
export function DatePicker({ date, setDate }: Props) {
  const [open, setOpen] = React.useState(false)


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="data-[empty=true]:text-muted-foreground flex-1 justify-start text-left font-normal "
        >
          <CalendarIcon />
          {date ? format(date, "dd-MM-yyyy") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={(date)=>{
          setDate && setDate(date || undefined)
          setOpen(false)
        }} />
      </PopoverContent>
    </Popover>
  )
}