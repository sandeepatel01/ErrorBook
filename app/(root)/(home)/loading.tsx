import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <section className="p-4 md:p-8">
      {/* Title */}
      <h1 className="h1-bold text-dark100_light900 mb-4 md:mb-6">
        All Questions
      </h1>

      {/* Search input */}
      <div className="my-6 flex flex-wrap gap-5">
        <Skeleton className="h-12 flex-1 rounded-[8px] sm:w-4/5 md:w-[400px]" />
        <Skeleton className="h-12 w-28 rounded-[8px] lg:hidden" />
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap justify-center gap-4 sm:justify-start">
        {[1, 2, 3, 4].map((tab) => (
          <Skeleton
            key={tab}
            className="h-10 w-28 rounded-[6px] sm:w-32 md:w-36"
          />
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <div
            key={item}
            className="rounded-[12px] border bg-light-900 p-4 shadow-sm dark:bg-dark-200 md:p-6"
          >
            <div className="space-y-4">
              {/* Title */}
              <Skeleton className="h-6 w-3/4 rounded-[4px]" />

              {/* Tags */}
              <div className="flex flex-wrap gap-2 sm:gap-4">
                <Skeleton className="h-6 w-20 rounded-[6px]" />
                <Skeleton className="h-6 w-20 rounded-[6px]" />
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <Skeleton className="h-5 w-28 rounded-[4px]" />
                <Skeleton className="h-5 w-20 rounded-[4px]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Loading;
