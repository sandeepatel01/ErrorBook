import UserCard from "@/components/cards/UserCard";
import Filter from "@/components/shared/Filter";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { UserFilters } from "@/constants/filters";
import { getAllUsers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import Link from "next/link";
import React, { Suspense } from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community | ErrorBook",
};

const Page = async ({ searchParams }: SearchParamsProps) => {
  const queryObj = await Promise.resolve(searchParams ?? {});
  const searchQuery = queryObj.q || "";

  const result = await getAllUsers({
    searchQuery,
    filter: queryObj.filter || "",
    page: queryObj?.page ? +queryObj.page : 1,
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Users</h1>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/community"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search  for amazing developers..."
          otherClasses="flex-1"
        />

        <Filter
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w[170px] "
        />
      </div>

      <section className="mt-12 flex flex-wrap gap-4">
        {result.users.length > 0 ? (
          result.users.map((user) => <UserCard key={user._id} user={user} />)
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
            <p>No users yet</p>
            <Link href="/sign-up" className="mt-2 font-bold text-accent-blue">
              Join to the first!
            </Link>
          </div>
        )}
      </section>

      <div className="mt-10">
        <Pagination
          pageNumber={queryObj?.page ? +queryObj.page : 1}
          isNext={result.isNext}
        />
      </div>
    </Suspense>
  );
};

export default Page;
