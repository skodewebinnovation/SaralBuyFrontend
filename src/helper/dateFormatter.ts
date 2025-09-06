import { format as formatDate } from "date-fns";

export const dateFormatter = (date: Date, pattern: string = "dd-MM-yyyy") => {
  if(!date) return 'please provide a date'
  return formatDate(date, pattern);
};
