import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser, deleteUser, updateUser } from "@/lib/actions/user.action";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.NEXT_CLERK_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env.local",
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Handle event based on event type
  const eventType = evt.type;

  // console.log({eventType});

  if (eventType === "user.created") {
    const {
      id,
      email_addresses: emailAddresses,
      first_name: firstName,
      last_name: lastName,
      image_url: imageUrl,
      username,
    } = evt.data;

    // Convert email_addresses, first_name, last_name, and image_url to camelCase
    // Now using emailAddresses, firstName, lastName, imageUrl

    // Create a new user in the database
    const mongoUser = await createUser({
      clerkId: id,
      name: `${firstName}${lastName ? `${lastName}` : ""}`,
      username: username!,
      email: emailAddresses[0].email_address, // Ensure email_addresses is correctly accessed
      picture: imageUrl,
    });

    return NextResponse.json({
      message: "OK",
      user: mongoUser,
    });
  }

  if (eventType === "user.updated") {
    const {
      id,
      email_addresses: emailAddresses,
      first_name: firstName,
      last_name: lastName,
      image_url: imageUrl,
      username,
    } = evt.data;

    // Update the user in the database
    const mongoUser = await updateUser({
      clerkId: id,
      updateData: {
        name: `${firstName}${lastName ? `${lastName}` : ""}`,
        username: username!,
        email: emailAddresses[0].email_address, // Ensure email_addresses is correctly accessed
        picture: imageUrl,
      },
      path: `/profile/${id}`,
    });

    return NextResponse.json({
      message: "OK",
      user: mongoUser,
    });
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    // Delete the user from the database
    const deletedUser = await deleteUser({
      clerkId: id!,
    });

    return NextResponse.json({
      message: "OK",
      user: deletedUser,
    });
  }

  return new Response("Webhook received", { status: 200 });
}
