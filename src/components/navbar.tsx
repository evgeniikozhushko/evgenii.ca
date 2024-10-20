// import React, { useEffect, useState } from "react";
import { useEffect, useState } from "react";
import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { link as linkStyles } from "@nextui-org/theme";
import clsx from "clsx";
// import { fetchLightLogo, fetchDarkLogo } from "@/contentful/core";
// import { fetchLogo } from "@/contentful/core";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { useTheme } from "@/hooks/use-theme"; // Import useTheme hook
import {
  GithubIcon,
  DiscordIcon,
  SearchIcon,
} from "@/components/icons";
import { LinkedinIcon, InstagramIcon } from "@/components/icons";
// import { Logo } from "@/components/icons";
import SliderBanner from "@/components/sliderBanner";

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme(); // Track current theme (dark or light)
  console.log("the theme is", theme)

  const lightLogoSrc = "/logos/Evgenii_Logo_LightMode.png";
  const darkLogoSrc = "/logos/Evgenii_Logo_DarkMode.png";

  const [loading, setLoading] = useState(true); // For initial loading state
  const [menuOpen, setMenuOpen] = useState(false); // Add state for menu toggle

  // Fetch both logos on mount
  // useEffect(() => {
  //   const fetchLogos = async () => {
  //     try {
  //       const [lightLogo, darkLogo] = await Promise.all([
  //         fetchLightLogo(),
  //         fetchDarkLogo(),
  //       ]);
  //       console.log("lightLogo", lightLogo)
  //       console.log("darkLogo", darkLogo)
  //       setLogos({ light: lightLogo, dark: darkLogo });
  //     } catch (error) {
  //       console.error("Error fetching logos:", error);
  //     } finally {
  //       setLoading(false); // Hide loading state once the logos are fetched
  //     }
  //   };

  //   fetchLogos();
  // }, []); // Empty dependency array to run only once on mount

  // const [logoUrl, setLogoUrl] = useState<string | null>(null);
  // const [loading, setLoading] = useState(true);

  // Preload both logos on mount
  // Fetch the appropriate logo when the theme changes
  // useEffect(() => {
  //   const setLogoBasedOnTheme = async () => {
  //     setLoading(true);
  //     const logo = theme === "dark" ? await fetchDarkLogo() : await fetchLightLogo();
  //     setLogoUrl(logo);
  //     setLoading(false);
  //   };

  //   setLogoBasedOnTheme();
  // }, [theme]);

  // Search input field
  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    <> 
    {/* <SliderBanner /> */}
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link href="/">
            {/* Dynamically choose the logo based on the current theme */}
            <img src={theme === "dark" ? darkLogoSrc : lightLogoSrc} alt="Evgenii.ca Logo" width="30" height="30" />
          </Link>
        </NavbarBrand>
        <div className="hidden md:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <Link
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>
      
      {/* Social icons */}
      <NavbarContent
        className="sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="flex gap-3">
          <Link isExternal href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <Link isExternal href={siteConfig.links.linkedin}>
            <LinkedinIcon className="text-default-500" />
          </Link>
          <Link isExternal href={siteConfig.links.instagram}>
            <InstagramIcon className="text-default-500" />
          </Link>
          <Link isExternal href={siteConfig.links.discord}>
            <DiscordIcon className="text-default-500" />
          </Link>
          <ThemeSwitch className="hidden md:inline-block"/>
        </NavbarItem>
        {/* <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem> */}
        <NavbarItem className="hidden md:flex">
          {/* <Button
            isExternal
            as={Link}
            className="text-sm font-normal text-default-600 bg-default-100"
            href={siteConfig.links.sponsor}
            startContent={<HeartFilledIcon className="text-danger" />}
            variant="flat"
          >
            Sponsor
          </Button> */}
        </NavbarItem>
      </NavbarContent>

      {/* Hamburger menu for mobile */}
      <NavbarContent className="md:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      {/* <NavbarMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)}> */}
      <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
              
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href={item.href}
                size="lg"
                onClick={() => setMenuOpen(false)} // Close the menu on click
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
    </>
    
  );
};
