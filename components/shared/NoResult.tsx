"use client";

import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";
import { Button } from "../ui/button";

interface NoResultProps {
  title: string;
  description: string;
  link: string;
  linkTitle: string;
}

const NoResult = ({ title, description, link, linkTitle }: NoResultProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="mt-10 flex w-full flex-col items-center justify-center">
        <Image
          src="/assets/images/light-illustration.png"
          width={270}
          height={200}
          alt="No Result illustration"
          className="block object-contain dark:hidden"
        />
        <Image
          src="/assets/images/dark-illustration.png"
          width={270}
          height={200}
          alt="No Result illustration"
          className="hidden object-contain dark:flex"
        />
        <h2 className="h2-bold text-dark200_light900 mt-8">{title}</h2>
        <p className="body-regular text-dark500_light700 my-3.5 max-w-md text-center">
          {description}
        </p>
        <Link href={link}>
          <Button className="paragraph-medium mt-5 min-h-[46px] rounded-xl bg-primary-500 px-4 py-3 text-light-900 hover:bg-primary-500 dark:bg-primary-500 dark:text-light-900">
            {linkTitle}
          </Button>
        </Link>
      </div>
    </Suspense>
  );
};

export default NoResult;
