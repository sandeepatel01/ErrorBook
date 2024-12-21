import Profile from "@/components/forms/Profile";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import React, { Suspense } from "react";

const Page = async () => {
  const authResult = await auth();

  // Extract the userId (or 'sub') from the auth object
  const userId = authResult?.userId;

  if (!userId) {
    console.error("User not authenticated");
    return null;
  }

  const mongoUser = await getUserById({ userId });

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="mt-9">
          <Profile clerkId={userId} user={JSON.stringify(mongoUser)} />
        </div>
      </Suspense>
    </>
  );
};

export default Page;
