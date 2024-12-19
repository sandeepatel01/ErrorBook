"use client";

import { Button } from "@/components/ui/button";
import { GlobalSearchFilters } from "@/constants/filters";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";

const GlobalFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const typeParam = searchParams.get("type");

  const [active, setActive] = useState(typeParam || "");

  const handleTypeClick = (item: string) => {
    if (active === item) {
      setActive("");
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: null,
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActive(item);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: item.toLocaleLowerCase(),
      });

      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex items-center gap-5 px-5">
        <p className="body-medium text-dark400_light900">Type: </p>

        <div className="flex gap-3">
          {GlobalSearchFilters.map((item) => (
            <Button
              type="button"
              key={item.value}
              className={`light-border-2 small-medium rounded-2xl px-5 py-2 capitalize dark:text-light-800 dark:hover:text-primary-500 ${active === item.value ? "bg-primary-500 text-light-900 hover:bg-primary-500" : "bg-light-700 text-dark-400 hover:bg-light-700 hover:text-primary-500 dark:bg-dark-500"}`}
              onClick={() => handleTypeClick(item.value)}
            >
              {item.name}
            </Button>
          ))}
        </div>
      </div>
    </Suspense>
  );
};

export default GlobalFilters;
