"use client";

import React, { Suspense } from "react";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { sidebarLinks } from "@/constants/constants";
import { usePathname } from "next/navigation";

const NavContent = () => {
  const pathname = usePathname();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <section className="flex h-full flex-col gap-6 pt-16">
        {sidebarLinks.map((item) => {
          const isActive =
            (pathname.includes(item.route) && item.route.length > 1) ||
            pathname === item.route;
          return (
            <SheetClose asChild key={item.route}>
              <Link
                href={item.route}
                className={`${
                  isActive
                    ? "primary-gradient rounded-[8px] text-light-900"
                    : "text-dark300_light900"
                } flex items-center justify-start gap-4 bg-transparent p-4`}
              >
                <Image
                  src={item.imgURL}
                  width={20}
                  height={20}
                  alt={item.label}
                  className={`${isActive ? "" : "invert-colors"}`}
                />
                <p className={`${isActive ? "base-bold" : "base-medium"}`}>
                  {item.label}
                </p>
              </Link>
            </SheetClose>
          );
        })}
      </section>
    </Suspense>
  );
};

const MobileNav = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Sheet>
        <SheetTrigger asChild>
          <Image
            src="/assets/icons/hamburger.svg"
            width={36}
            height={36}
            alt="hamburger"
            className="invert-colors sm:hidden"
          />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="border-none bg-light-900 dark:bg-dark-100"
        >
          {/* <Link href="/" className="flex items-center gap-1">
            <Image
              src={"/assets/images/logo.svg"}
              width={45}
              height={45}
              alt="ErrorBook"
            />
            <p className="h2-bold flex items-center justify-center text-dark-200 dark:text-light-900">
              <span className="text-3xl font-extrabold">ErrorBook</span>
            </p>
          </Link> */}

          <Link
            href="/"
            className="ml-[-180px] mt-1 flex flex-col items-center gap-1"
          >
            <div className="flex items-center gap-2">
              <Image
                src={"/assets/images/logo.svg"}
                width={45}
                height={45}
                alt="ErrorBook"
              />
              <p className="h2-bold flex items-center justify-center text-dark-200 dark:text-light-900">
                <span className="text-xl font-extrabold sm:text-2xl md:text-3xl">
                  ErrorBook
                </span>
              </p>
            </div>
            <div className="">
              <p className="ml-40 mt-[-14px] text-sm text-gray-500 dark:text-gray-400">
                Powered by
                <span className="font-bold text-[#137abc]"> SharpCareer</span>
              </p>
            </div>
          </Link>

          <div>
            <SheetClose asChild>
              <NavContent />
            </SheetClose>

            <SignedOut>
              <div className="flex flex-col gap-3">
                <SheetClose asChild>
                  <Link href="/sign-in">
                    <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-xl px-4 py-3 shadow-none">
                      <span className="primary-text-gradient">Log In</span>
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/sign-up">
                    <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-xl px-4 py-3 shadow">
                      Sign Up
                    </Button>
                  </Link>
                </SheetClose>
              </div>
            </SignedOut>
          </div>
        </SheetContent>
      </Sheet>
    </Suspense>
  );
};

export default MobileNav;
