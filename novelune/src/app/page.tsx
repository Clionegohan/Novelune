"use client";

import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";

const Home = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { user } = useUser();

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="h-screen flex items-center justify-center flex-col gap-y-4">
      <h1 className="text-xl font-semibold">ようこそ！</h1>
      
      {isAuthenticated? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg">こんにちは、{user?.firstName}さん！</p>
          <SignOutButton>
            <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
              ログアウト
            </button>
          </SignOutButton>
        </div>
      ) : (
        <div className="flex gap-4">
          <SignInButton>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              ログイン
            </button>
          </SignInButton>
        </div>
      )}
    </div>
  );
};

export default Home;
