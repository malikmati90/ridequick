import { MapPin, Car, Plane, PlaneLanding, PlaneIcon, Clock, Crown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import Link from "next/link";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface HeaderProps {
  logo?: {
    url: string;
    src?: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
}

const Header = ({
  logo = {
    url: "/",
    // src: "https://shadcnblocks.com/images/block/logos/shadcnblockscom-icon.svg",
    alt: "logo",
    title: "RideQuick",
  },

  menu = [
    { title: "Features", url: "/#features" },
    { title: "How It Works", url: "/#how-it-works" },
    {
      title: "Services",
      url: "/#services",
      // items: [
      //   { title: "Standard Taxi", url: "#standard-taxi", icon: <Car className="h-5 w-5 text-yellow-500" /> },
      //   { title: "VIP/VTC Service", url: "#vtc-service", icon: <Crown className="h-5 w-5 text-yellow-500" /> },
      //   { title: "Airport Transfers", url: "#airport-transfers", icon: <Plane className="h-5 w-5 text-yellow-500" /> },
      //   { title: "Hourly/Charter Service", url: "#hourly-service", icon: <Clock className="h-5 w-5 text-yellow-500" /> },
      // ],
    },
    { title: "Testimonials", url: "/#testimonials" },
    { title: "FAQs", url: "/#faq" },
  ],

  auth = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Sign up", url: "/sign-up" },
  },
}: HeaderProps) => {

  return (
    <section className="py-4 sticky top-0 z-50 bg-white"> {/* Sticky Header */}
      <div className="container">
        {/* Desktop Menu */}
        <nav className="hidden justify-between lg:flex w-full">
          <div className="flex items-center gap-6 max-w-screen-xl mx-auto justify-between">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-yellow-500" />
              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
            </a>
            {/* Navigation Menu */}
            <div className="flex items-center gap-6">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          {/* Book a Ride Button */}
          <div className="flex gap-4">
            <Button asChild variant="outline" size="sm">
              <Link href={auth.login.url}>{auth.login.title}</Link>
            </Button>
            <Button asChild size="sm">
              <Link href={auth.signup.url}>{auth.signup.title}</Link>
            </Button>
            {/* <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
              Book a Ride
            </Button> */}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center gap-4 justify-between p-4">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-yellow-500" />
            </a>
            {/* Mobile Menu Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <a href={logo.url} className="flex items-center gap-2">
                      <MapPin className="h-6 w-6 text-yellow-500" />
                    </a>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>
          
                  {/* Book a Ride Button */}
                  <div className="flex flex-col gap-3">
                    <Button asChild variant="outline">
                      <a href={auth.login.url}>{auth.login.title}</a>
                    </Button>
                    <Button asChild>
                      <a href={auth.signup.url}>{auth.signup.title}</a>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

// Render Menu Item (with sub-items if available)
const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group inline-flex h-10 w-max items-center justify-center 
        rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors 
        hover:bg-muted hover:text-accent-foreground"
        >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

// Render Mobile Menu Item (with sub-items if available)
const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-2 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="text-md font-semibold hover:text-yellow-500">
      {item.title}
    </a>
  );
};

// Submenu Link Component
const SubMenuLink = ({ item }: { item: MenuItem}) => {
  return (
    <a
      className="flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
      href={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
      </div>
    </a>
  );
};

export { Header };
