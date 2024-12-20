import { Button } from "@/components/ui/button";
import { getUserInfo } from "@/lib/actions/user.action";
import { URLProps } from "@/types";
import { SignedIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";
import { getJoinedDate } from "@/lib/utils";
import ProfileLink from "@/components/shared/ProfileLink";
import Stats from "@/components/shared/Stats";
import QuestionTab from "@/components/shared/QuestionTab";
import AnswerTab from "@/components/shared/AnswerTab";
// import Loading from "./loading";

const page = async ({ params, searchParams }: URLProps) => {
  if (!params) {
    return <div>Error: No user found</div>;
  }

  const resolvedParams = await params;
  const { id } = resolvedParams;

  const queryObj = (await searchParams) || {};

  const { userId: clerkId } = await auth();

  const userInfo = await getUserInfo({ userId: id });
  // // Convert userInfo to a plain object
  // const plainUserInfo = JSON.parse(JSON.stringify(userInfo));

  const plainUserInfo = userInfo;

  // const isLoading = true;
  // if (isLoading) return <Loading />;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Image
            src={plainUserInfo?.user.picture}
            width={140}
            height={140}
            alt="user profile image"
            className="rounded-full object-cover"
          />

          <div className="mt-3">
            <h2 className="h2-bold text-dark200_light900">
              {plainUserInfo?.user.name}
            </h2>
            <p className="paragraph-regular text-dark200_light800">
              @{plainUserInfo?.user.username}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {plainUserInfo?.user.portfolioWebsite && (
                <ProfileLink
                  imgUrl="/assets/icons/link.svg"
                  href={plainUserInfo?.user.portfolioWebsite}
                  title="Portfolio"
                />
              )}

              {userInfo?.user.location && (
                <ProfileLink
                  imgUrl="/assets/icons/location.svg"
                  title={plainUserInfo?.user.location}
                />
              )}

              <ProfileLink
                imgUrl="/assets/icons/calendar.svg"
                title={getJoinedDate(plainUserInfo?.user.createdAt)}
              />
            </div>
            {userInfo?.user.bio && (
              <p className="paragraph-regular text-dark400_light800 mt-8">
                {plainUserInfo?.user.bio}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          <SignedIn>
            {clerkId === plainUserInfo?.user.clerkId && (
              <Link href="/profile/edit">
                <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] rounded-xl px-4 py-3">
                  Edit Profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>

      <Stats
        reputation={plainUserInfo?.reputation}
        totalQuestions={plainUserInfo.totalQuestions}
        totalAnswers={plainUserInfo.totalAnswers}
        badges={plainUserInfo.badgeCounts}
      />

      <div className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="tab">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="top-posts"
            className="mt-5 flex w-full flex-col gap-6"
          >
            <QuestionTab
              searchParams={queryObj}
              userId={plainUserInfo?.user._id}
              clerkId={clerkId}
            />
          </TabsContent>
          <TabsContent value="answers" className="flex w-full flex-col gap-6">
            <AnswerTab
              searchParams={queryObj}
              userId={plainUserInfo?.user._id}
              clerkId={clerkId}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Suspense>
  );
};

export default page;
