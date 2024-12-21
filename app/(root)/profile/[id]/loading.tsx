import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <section className="p-4 md:p-6">
      {/* <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-8">
        <Skeleton className="size-24 rounded-[12px]" />
        <div className="hidden w-full flex-col gap-2 md:flex md:w-3/4">
          <Skeleton className="h-6 w-1/3 rounded-[8px]" />
          <Skeleton className="h-4 w-1/4 rounded-[6px]" />
        </div>
        <Skeleton className="mb-4 h-10 w-28 rounded-[8px] md:mb-0" />{" "}
      </div> */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6 md:gap-8">
        {/* Avatar - Left Aligned */}
        <Skeleton className="size-24 rounded-full sm:size-28 md:size-24 lg:size-24" />

        {/* Info Section */}
        <div className="flex w-full flex-col gap-2 sm:ml-4 sm:gap-3 md:w-3/4">
          <Skeleton className="h-6 w-2/3 rounded-[8px] sm:h-8 sm:w-3/4 md:h-9 md:w-1/2 lg:w-1/3" />
          <Skeleton className="h-4 w-1/4 rounded-[8px] sm:h-5 sm:w-1/3 md:h-6 md:w-1/4" />
        </div>
      </div>

      <div className="my-8 flex flex-wrap justify-center gap-6">
        <Skeleton className="h-24 w-28 rounded-[8px] md:h-28 md:w-32 lg:h-32 lg:w-36 xl:w-40" />
        <Skeleton className="h-24 w-28 rounded-[8px] md:h-28 md:w-32 lg:h-32 lg:w-36 xl:w-40" />
        <Skeleton className="h-24 w-28 rounded-[8px] md:h-28 md:w-32 lg:h-32 lg:w-36" />
        <Skeleton className="h-24 w-28 rounded-[8px] md:h-28 md:w-32 lg:h-32 lg:w-40" />
      </div>

      <div className="mt-4 flex gap-4">
        <Skeleton className="h-10 w-28 rounded-[8px]" />
        <Skeleton className="h-10 w-28 rounded-[8px]" />
      </div>

      <div className="mt-6 space-y-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="rounded-[10px] border border-gray-200 p-4">
            <Skeleton className="mb-2 h-6 w-3/4 rounded-[8px]" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-14 rounded-[6px]" />
              <Skeleton className="h-6 w-14 rounded-[6px]" />
              <Skeleton className="h-6 w-20 rounded-[6px]" />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Skeleton className="h-6 w-24 rounded-[6px]" />

              <Skeleton className="h-6 w-12 rounded-[6px]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Loading;
