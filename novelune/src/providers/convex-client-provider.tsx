"use client";
import { ReactNode } from "react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl || convexUrl.trim() === '') {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is missing or empty");
}

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!clerkPublishableKey || clerkPublishableKey.trim() === '') {
    throw new Error("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is missing or empty");
}

const convex = new ConvexReactClient(convexUrl);

const ConvexClientProvider = ({ children }: { children: ReactNode }) => {
    return (
        <ClerkProvider publishableKey={clerkPublishableKey}>
            <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
                {children}
            </ConvexProviderWithClerk>
        </ClerkProvider>
    );
};

export default ConvexClientProvider;
