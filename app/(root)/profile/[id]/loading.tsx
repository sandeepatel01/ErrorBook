import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <section className="p-4 md:p-6">
      <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-8">
        <Skeleton className="size-24 rounded-[12px]" />
        <div className="hidden w-full flex-col gap-2 md:flex md:w-3/4">
          <Skeleton className="h-6 w-1/3 rounded-[8px]" />
          <Skeleton className="h-4 w-1/4 rounded-[6px]" />
        </div>
        <Skeleton className="mb-4 h-10 w-28 rounded-[8px] md:mb-0" />{" "}
      </div>

      <div className="my-8 hidden flex-wrap justify-around gap-4 md:flex">
        <Skeleton className="h-20 w-24 rounded-[10px] md:h-16 md:w-20 lg:h-24 lg:w-32" />
        <Skeleton className="h-20 w-24 rounded-[10px] md:h-16 md:w-20 lg:h-24 lg:w-32" />
        <Skeleton className="h-20 w-24 rounded-[10px] md:h-16 md:w-20 lg:h-24 lg:w-32" />
        <Skeleton className="h-20 w-24 rounded-[10px] md:h-16 md:w-20 lg:h-24 lg:w-32" />
        <Skeleton className="h-20 w-24 rounded-[10px] md:h-16 md:w-20 lg:h-24 lg:w-32" />
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
