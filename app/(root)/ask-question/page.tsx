import Question from "@/components/forms/Question";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

const page = async () => {
  const authResult = await auth();
  const { userId } = authResult;

  if (!userId) {
    redirect("/sign-in");
    return null;
  }

  // Fetch user data from the database
  const mongoUser = await getUserById({ userId });

  // Handle the case where mongoUser is null or undefined
  if (!mongoUser) {
    console.error("Mongo User not found");
    redirect("/error");
    return null;
  }

  // console.log("Mongo User: ", mongoUser);

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
      <div className="mt-9">
        <Suspense fallback={<div>Loading...</div>}>
          <Question mongoUserId={JSON.stringify(mongoUser._id)} />
          {/* <Question mongoUserId={mongoUser._id.toString()} /> */}
        </Suspense>
      </div>
    </div>
  );
};

export default page;
