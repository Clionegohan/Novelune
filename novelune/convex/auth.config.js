const domain =
    process.env.NEXT_PUBLIC_CLERK_DOMAIN || "https://hip-cricket-51.clerk.accounts.dev";

const authConfig = {
    providers: [
        {
            domain,
            applicationID: "convex",
        },
    ]
};

export default authConfig;
