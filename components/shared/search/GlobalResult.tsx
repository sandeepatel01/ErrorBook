"use client";

import React, { Suspense, useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import GlobalFilters from "./GlobalFilters";
import { globalSearch } from "@/lib/actions/general.action";

const GlobalResult = () => {
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState([
    { type: "user", id: "1", title: "Sandy" },
    { type: "question", id: "1", title: "Next.js 13" },
    { type: "tag", id: "1", title: "Next" },
  ]);

  const global = searchParams.get("global");
  const type = searchParams.get("type");

  useEffect(() => {
    const fetchResult = async () => {
      setResult([]);
      setIsLoading(true);

      try {
        const response = await globalSearch({ query: global, type });

        setResult(JSON.parse(response));
      } catch (error) {
        console.error("Error fetching result: ", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    };

    if (global) fetchResult();
  }, [global, type]);

  const renderLink = (type: string, id: string) => {
    switch (type) {
      case "user":
        return `/profile/${id}`;

      case "tag":
        return `/tags/${id}`;

      case "answer":
        return `/questions/${id}`;

      case "question":
        return `/questions/${id}`;

      default:
        return `/`;
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="absolute top-full z-10 mt-3 w-full rounded-xl bg-light-800 py-5 shadow-sm dark:bg-dark-400">
        {/* <p className="paragraph-semibold text-dark400_light900 px-5">Filters</p> */}
        <GlobalFilters />

        <div className="my-5 h-px bg-light-700/50 dark:bg-dark-500/50" />
        <div className="space-y-5">
          <p className="paragraph-semibold text-dark400_light900 px-5">
            Top Match
          </p>

          {isLoading ? (
            <div className="flex-center flex-col px-5">
              <ReloadIcon className="my-2 size-10 animate-spin text-primary-500" />
              <p className="body-regular text-dark200_light800">
                Browing the entire database
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {result.length > 0 ? (
                result.map((item: any, index: number) => (
                  <Link
                    href={renderLink(item.type, item.id)}
                    key={item.type + item.id + index}
                    className="flex w-full cursor-pointer items-start gap-3 px-5 py-2.5 hover:bg-light-700/50 dark:hover:bg-dark-500/50"
                  >
                    <Image
                      src="/assets/icons/tag.svg"
                      alt="tag"
                      width={18}
                      height={18}
                      className="invert-colors mt-1 object-contain"
                    />

                    <div className="flex flex-col">
                      <p className="body-medium text-dark200_light800 line-clamp-1">
                        {item.title}
                      </p>
                      <p className="text-light400_light500 small-medium mt-1 font-bold">
                        {item.type}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="flex-center flex-col px-5">
                  <p className="body-regular text-dark200_light800 px-5 py-2.5">
                    Oops, no results found
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
};

export default GlobalResult;
