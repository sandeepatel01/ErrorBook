"use client";

import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface CustomInputProps {
  route: string;
  iconPosition: string;
  imgSrc: string;
  placeholder: string;
  otherClasses?: string;
}

const LocalSearchbar = ({
  route,
  iconPosition,
  imgSrc,
  placeholder,
  otherClasses,
}: CustomInputProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("q");

  const [search, setSearch] = useState(query || "");

  // useEffect(() => {
  //   const delayDebounceFn = setTimeout(() => {
  //     if (search) {
  //       const newUrl = formUrlQuery({
  //         params: searchParams.toString(),
  //         key: "q",
  //         value: search,
  //       });

  //       router.push(newUrl, { scroll: false });
  //     } else {
  //       if (pathname === route) {
  //         const newUrl = removeKeysFromQuery({
  //           params: searchParams.toString(),
  //           keysToRemove: ["q"],
  //         });

  //         router.push(newUrl, { scroll: false });
  //       }
  //     }
  //   }, 300);

  //   return () => clearTimeout(delayDebounceFn);
  // }, [search, searchParams, router, pathname, query, route]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const currentParams = Object.fromEntries(searchParams.entries());

      if (search) {
        const newUrl = formUrlQuery({
          params: currentParams,
          key: "q",
          value: search,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeysFromQuery({
            params: currentParams,
            keysToRemove: ["q"],
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, searchParams, router, pathname, query, route]);

  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          width={24}
          height={24}
          alt="search"
          className="cursor-pointer"
        />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="paragraph-regular no-focus background-light800_darkgradient border-none shadow-none outline-none placeholder:text-light-400 dark:placeholder:text-light-500"
      />

      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          width={24}
          height={24}
          alt="search"
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default LocalSearchbar;
