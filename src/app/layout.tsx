import { GeistSans } from "geist/font/sans";
import "@/app/globals.css";
import { cn } from "@/lib/utils";
import { Metadata, Viewport } from "next";
import { Providers } from "@/components/marketing/providers";
import { Toaster } from "@/components/ui/sonner";
import dynamic from "next/dynamic";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";

export const preferredRegion = "home";

// Dynamically import heavy components
const DynamicAnalytics = dynamic(
    () => import("@vercel/analytics/react").then((mod) => mod.Analytics),
);
const DynamicSpeedInsights = dynamic(
    () => import("@vercel/speed-insights/next").then((mod) => mod.SpeedInsights),
);

const siteConfig = {
    name: "ProductAxis",
    description: "AI-powered workflow automation and code generation",
    url: "https://productaxis.idoko.com",
    ogImage: "https://productaxis.idoko.com/og.png",
    creator: "Idoko",
    twitterHandle: "@idoko",
};

export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: siteConfig.name,
    description: siteConfig.description,
    openGraph: {
        type: "website",
        locale: "en_US",
        url: siteConfig.url,
        siteName: siteConfig.name,
        title: siteConfig.name,
        description: siteConfig.description,
        images: [
            {
                url: siteConfig.ogImage,
                width: 1200,
                height: 630,
                alt: siteConfig.name,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: siteConfig.name,
        description: siteConfig.description,
        images: [siteConfig.ogImage],
        creator: siteConfig.twitterHandle,
    },
    keywords: [
        "axis ui",
        "UI design",
        "UI generation",
        "AI",
        "generative UI",
        "generative design",
        "Next.js",
        "React",
        "Tailwind CSS",
        "Shadcn UI",
    ],
    authors: [{ name: siteConfig.creator, url: "https://github.com/julian-at" }],
    creator: siteConfig.creator,
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon-16x16.png",
        apple: "/apple-touch-icon.png",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    minimumScale: 1,
    maximumScale: 1,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={cn("font-normal antialiased", GeistSans.className)}>
        <Providers
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
            <div className="flex h-screen w-full overflow-hidden">
                <AppSidebar />
                <SidebarInset className="flex flex-col flex-1 overflow-hidden bg-background">
                    {children}
                </SidebarInset>
            </div>
            <Toaster />
        </Providers>
        <DynamicAnalytics />
        <DynamicSpeedInsights />
        </body>
        </html>
    );
}