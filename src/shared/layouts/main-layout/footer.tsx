import { CustomIcon } from "@/shared/ui/custom-icon";
import { cn } from "@sglara/cn";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const socials = [
  {
    icon: "youtube",
    url: "https://www.youtube.com/channel/UCld1sYd4aHddmPsJGa3YjQw",
  },
  {
    icon: "twitter",
    url: "https://twitter.com/tradeit_gg",
  },
  {
    icon: "facebook",
    url: "https://www.facebook.com/tradeitgg",
  },
  {
    icon: "instagram",
    url: "https://www.instagram.com/tradeit.gg/",
  },
  {
    icon: "discord",
    url: "https://discord.com/invite/tradeit",
  },
  {
    icon: "envelope",
    url: "mailto:support@tradeit.gg",
    type: "fas",
  },
];

interface LinksGroupProps {
  className?: string;
  title: string;
  items: {
    label: string;
    url: string;
    gradient?: boolean;
  }[];
}
const LinksGroup = (props: LinksGroupProps) => {
  return (
    <div className={cn("flex flex-col", props.className)}>
      <span className="mb-3 font-bold">{props.title}</span>
      <div className="flex flex-col space-y-3">
        {props.items.map((item, i) =>
          item.gradient ? (
            <Link
              key={i}
              href={item.url}
              className="bg-gradient-to-b from-white to-purple-400 bg-clip-text text-sm font-medium text-transparent hover:text-white"
              style={{
                background:
                  "linear-gradient(to bottom, #ffffff 0%, #ffffff 30%, #9494dc 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {item.label}
            </Link>
          ) : (
            <Link
              key={i}
              href={item.url}
              className="text-muted hover:text-foreground text-sm font-medium"
            >
              {item.label}
            </Link>
          ),
        )}
      </div>
    </div>
  );
};

export default function Footer() {
  return (
    <footer className="border-t border-[#252632] bg-[#121218]">
      <div className="container px-6 pt-[64px]">
        <div className="flex justify-between">
          <div>
            <CustomIcon.Logo />
            <div className="mt-6 flex items-center gap-2">
              {socials.map((item, i) => (
                <Link
                  key={i}
                  href={item.url}
                  target="_blank"
                  className="group grid h-[40px] w-[43px] place-items-center rounded-sm bg-[#1c1d26]"
                >
                  <CustomIcon.Awesome
                    name={item.icon}
                    type={(item.type as any) ?? "fab"}
                    className="text-muted group-hover:text-foreground"
                  />
                </Link>
              ))}
            </div>
          </div>
          <div className="ml-auto flex justify-between gap-10">
            <LinksGroup
              className="mr-10"
              title="Sites"
              items={[
                {
                  label: "Affiliate Program",
                  url: "https://tradeit.gg/affiliate",
                },
                {
                  label: "Blog",
                  url: "https://tradeit.gg/blog",
                },
                {
                  label: "Bug Bounty",
                  url: "https://try.tradeit.gg/security/?_gl=1*dep56b*_gcl_au*MTU5MDQ4ODE5OC4xNzU1NDI5ODgy*_ga*MTE4NDM5NDg1Mi4xNzU1MTA4MjQ3*_ga_RFHNPQTN51*czE3NTU0NTg1ODkkbzExJGcxJHQxNzU1NDYxMzIwJGo2MCRsMCRoMA..",
                },
                {
                  label: "We are hiring",
                  url: "https://try.tradeit.gg/hiring/?_gl=1*dep56b*_gcl_au*MTU5MDQ4ODE5OC4xNzU1NDI5ODgy*_ga*MTE4NDM5NDg1Mi4xNzU1MTA4MjQ3*_ga_RFHNPQTN51*czE3NTU0NTg1ODkkbzExJGcxJHQxNzU1NDYxMzIwJGo2MCRsMCRoMA..",
                  gradient: true,
                },
                {
                  label: "Invest Now",
                  url: "https://tradeit.gg/invest",
                },
                {
                  label: "Help Center",
                  url: "https://support.tradeit.gg/en/?_gl=1*q7alab*_gcl_au*MTU5MDQ4ODE5OC4xNzU1NDI5ODgy*_ga*MTE4NDM5NDg1Mi4xNzU1MTA4MjQ3*_ga_RFHNPQTN51*czE3NTU0NTg1ODkkbzExJGcxJHQxNzU1NDYxMzIwJGo2MCRsMCRoMA..",
                },
                {
                  label: "Contact us",
                  url: "https://tradeit.gg/contact-us",
                },
                {
                  label: "About Us",
                  url: "https://tradeit.gg/about-us",
                },
              ]}
            />
            <LinksGroup
              title="Tools"
              items={[
                {
                  label: "Steamid Finder",
                  url: "https://tradeit.gg/steam-id-finder",
                },
                {
                  label: "CS2 Float Checker",
                  url: "https://tradeit.gg/cs2-float-checker",
                },
                {
                  label: "CS2 Status",
                  url: "https://tradeit.gg/cs2-status",
                },
                {
                  label: "Inventory Value Calculator",
                  url: "https://tradeit.gg/cs2-inventory-value",
                },
                {
                  label: "CS2 Skins Wiki",
                  url: "https://tradeit.gg/cs2-skins",
                },
              ]}
            />
            <LinksGroup
              title="Terms"
              items={[
                {
                  label: "Terms Of Use",
                  url: "https://tradeit.gg/tos",
                },
                {
                  label: "Privacy Policy",
                  url: "https://tradeit.gg/privacy",
                },
                {
                  label: "Cookie Policy",
                  url: "https://tradeit.gg/cookie",
                },
                {
                  label: "Consent Preferences",
                  url: "https://tradeit.gg/#",
                },
              ]}
            />
          </div>
        </div>
        <div className="mt-12 flex items-center justify-between border-t border-[#252632] py-10">
          <p className="text-muted text-sm font-medium">
            © Tradeit.gg LLC 2017 - {new Date().getFullYear()}, All Rights
            Reserved.
          </p>
          <div>
            <Image
              src={"/images/landing-page/payment-list.png"}
              alt=""
              width={270}
              height={24}
              className="ml-auto"
            />
            <p className="text-muted mt-3 text-sm font-medium">
              Support@tradeit.gg 16192 Coastal Hwy, Lewes, DE 19958, United
              States
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
