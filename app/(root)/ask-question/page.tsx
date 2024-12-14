// import Question from "@/components/forms/Question";
// import { getUserById } from "@/lib/actions/user.action";
// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
// import React from "react";

// const page = async () => {
//   const authResult = await auth();
//   const { userId } = authResult;

//   if (!userId) {
//     redirect("/sign-in");
//     return; // Ensure that the function exits after the redirect
//   }

//   // Fetch user data from the database
//   const mongoUser = await getUserById({ userId });

//   // Handle the case where mongoUser is null or undefined
//   if (!mongoUser) {
//     console.error("Mongo User not found");
//     redirect("/error"); // Or some appropriate fallback page
//     return; // Exit the function to prevent further execution
//   }

//   // console.log("Mongo User: ", mongoUser);

//   return (
//     <div>
//       <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
//       <div className="mt-9">
//         <Question mongoUserId={JSON.stringify(mongoUser._id)} />
//       </div>
//     </div>
//   );
// };

// export default page;
