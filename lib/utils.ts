import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimestamp = (createdAt: Date): string => {
  const now = new Date();
  const differenceInSeconds = Math.floor(
    (now.getTime() - createdAt.getTime()) / 1000,
  );

  if (differenceInSeconds < 60) {
    return `${differenceInSeconds} seconds ago`;
  }

  const differenceInMinutes = Math.floor(differenceInSeconds / 60);
  if (differenceInMinutes < 60) {
    return `${differenceInMinutes} minute${differenceInMinutes > 1 ? "s" : ""} ago`;
  }

  const differenceInHours = Math.floor(differenceInMinutes / 60);
  if (differenceInHours < 24) {
    return `${differenceInHours} hour${differenceInHours > 1 ? "s" : ""} ago`;
  }

  const differenceInDays = Math.floor(differenceInHours / 24);
  if (differenceInDays < 30) {
    return `${differenceInDays} day${differenceInDays > 1 ? "s" : ""} ago`;
  }

  const differenceInMonths = Math.floor(differenceInDays / 30);
  if (differenceInMonths < 12) {
    return `${differenceInMonths} month${differenceInMonths > 1 ? "s" : ""} ago`;
  }

  const differenceInYears = Math.floor(differenceInMonths / 12);
  return `${differenceInYears} year${differenceInYears > 1 ? "s" : ""} ago`;
};

export function formatNumber(num: number | undefined | null): string {
  // Check for invalid numbers (undefined or null)
  if (num === undefined || num === null) {
    return "0"; // or return a fallback value like 'N/A' depending on your use case
  }

  // Format based on number size
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + "K";
  } else {
    return num.toString();
  }
}

// export const getJoinedDate = (date: Date): string => {
//   // Extract the month and year from the Date object
//   const month = date.toLocaleString("default", { month: "long" });
//   const year = date.getFullYear();

//   // Create the joined date string (e.g., "September 2023")
//   const joinedDate = `${month} ${year}`;

//   return joinedDate;
// };

export const getJoinedDate = (date?: Date | string): string => {
  try {
    // Parse date if it is a string
    const validDate =
      date instanceof Date ? date : new Date(date || Date.now());

    if (isNaN(validDate.getTime())) {
      throw new Error("Invalid date");
    }

    const month = validDate.toLocaleString("default", { month: "long" });
    const year = validDate.getFullYear();

    return `${month} ${year}`;
  } catch (error) {
    console.error("Error in getJoinedDate:", error);
    return "Invalid Date";
  }
};

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true },
  );
};

interface removeUrlQueryParams {
  params: string;
  keysToRemove: string[];
}

export const removeKeysFromQuery = ({
  params,
  keysToRemove,
}: removeUrlQueryParams) => {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => delete currentUrl[key]);

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true },
  );
};
