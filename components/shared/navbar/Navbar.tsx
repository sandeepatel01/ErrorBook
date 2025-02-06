"use client";

import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";
import Theme from "./Theme";
import MobileNav from "./MobileNav";
import GlobalSearch from "../search/GlobalSearch";

const Navbar = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12">
        {/* <Link href="/" className="flex items-center gap-1">
          <Image
            src={"/assets/images/logo.svg"}
            width={45}
            height={45}
            alt="ErrorBook"
          />
          <p className="h2-bold flex items-center justify-center text-dark-200 dark:text-light-900 max-sm:hidden">
            <span className="text-xl font-extrabold sm:text-2xl md:text-3xl">
              ErrorBook
            </span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Powered by{" "}
            <span className="font-medium text-blue-600">SharpCareer</span>
          </p>
        </Link> */}

        <Link
          href="/"
          className="mt-1 flex flex-col items-center gap-1 max-sm:hidden"
        >
          <div className="flex items-center gap-2">
            <Image
              src={"/assets/images/logo.svg"}
              width={45}
              height={45}
              alt="ErrorBook"
            />
            <p className="h2-bold flex items-center justify-center text-dark-200 dark:text-light-900 max-sm:hidden">
              <span className="text-xl font-extrabold sm:text-2xl md:text-3xl">
                ErrorBook
              </span>
            </p>
          </div>
          <div className="max-sm:hidden">
            <p className="ml-24 mt-[-14px] text-sm text-gray-500 dark:text-gray-400">
              Powered by
              <span className="font-bold text-[#137abc]"> SharpCareer</span>
            </p>
          </div>
        </Link>
        <Link
          href="/"
          className="mt-1 flex flex-col items-center gap-1 md:hidden lg:hidden"
        >
          <div className="flex items-center gap-2">
            <Image
              src={"/assets/images/logo1.png"}
              width={45}
              height={45}
              alt="ErrorBook"
            />
            <p className="h2-bold flex items-center justify-center text-dark-200 dark:text-light-900 max-sm:hidden">
              <span className="text-xl font-extrabold sm:text-2xl md:text-3xl">
                SharpCareer
              </span>
            </p>
          </div>
        </Link>

        <GlobalSearch />
        <div className="flex-between gap-5">
          <Theme />
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10",
                },
                variables: {
                  colorPrimary: "#ff7000",
                },
              }}
            />
          </SignedIn>
          <MobileNav />
        </div>
      </nav>
    </Suspense>
  );
};

export default Navbar;
