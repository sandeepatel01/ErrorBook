import Image from "next/image";
import Link from "next/link";

interface UserCardProps {
  user: {
    _id: string;
    name: string;
    username: string;
    picture: string;
    clerkId: string;
  };
}

const UserCard = async ({ user }: UserCardProps) => {
  return (
    <Link
      href={`/profile/${user.clerkId}`}
      className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]"
    >
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <Image
          src={user.picture}
          width={100}
          height={100}
          alt="user profile image"
          className="rounded-full object-cover"
        />
        <div className="mt-4 text-center">
          <h3 className="h3-bold line-clamp-1 text-dark-200 dark:text-light-900">
            {user.name}
          </h3>
          <p className="body-regular text-dark500_light500 mt-2">
            @{user.username}
          </p>
        </div>
      </article>
    </Link>
  );
};

export default UserCard;
