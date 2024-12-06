"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";

const GlobalSearch = () => {
  return (
    <div className="relative w-full max-w-[600px] max-lg:hidden">
      <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
        <Image
          src="/assets/icons/search.svg"
          width={24}
          height={24}
          alt="search"
          className="cursor-pointer"
        />
        <Input
          type="text"
          placeholder="Search anything globally..."
          className="paragraph-regular no-focus background-light800_darkgradient border-none shadow-none outline-none placeholder:text-light-400 dark:placeholder:text-light-500"
        />
      </div>
    </div>
  );
};

export default GlobalSearch;
