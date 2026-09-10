import { Link } from "react-router-dom";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Work", to: "/#work" },
  { label: "Experience", to: "/#experience" },
  { label: "Skills", to: "/#skills" },
  { label: "Contact", to: "/#contact" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/thatboylewis?igsh=aTdxN3VqYW5qZG45",
    Icon: Icons.instagram,
  },
  {
    label: "X",
    href: "https://x.com/thatboylewis",
    Icon: Icons.twitter,
  },
  {
    label: "GitHub",
    href: "https://github.com/Lenny-Lewis",
    Icon: Icons.gitHub,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/lennox-lewis-975642359",
    Icon: Icons.linkedin,
  },
];

function StackedCircularFooter() {
  const handleSubscribe = (event) => {
    event.preventDefault();
    window.location.href = "/#contact";
  };

  return (
    <footer className="bg-background py-12 border-t border-white/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center">
          <div className="mb-8 rounded-full bg-primary/10 p-8 text-primary">
            <Icons.logo className="h-6 w-6" />
          </div>

          <nav className="mb-8 flex flex-wrap justify-center gap-6">
            {navItems.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="text-white-50 hover:text-primary transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="mb-8 flex space-x-4">
            {socialLinks.map(({ label, href, Icon }) => (
              <Button
                key={label}
                asChild
                variant="outline"
                size="icon"
                className="rounded-full border-white/15 text-white hover:text-primary hover:border-primary/40"
              >
                <a href={href} target="_blank" rel="noopener noreferrer">
                  <Icon className="h-4 w-4" />
                  <span className="sr-only">{label}</span>
                </a>
              </Button>
            ))}
          </div>

          <div className="mb-8 w-full max-w-md">
            <form className="flex space-x-2" onSubmit={handleSubscribe}>
              <div className="flex-grow">
                <Label htmlFor="email" className="sr-only">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  type="email"
                  required
                  className="rounded-full border-white/15 bg-white/5 text-white placeholder:text-white/40"
                />
              </div>
              <Button type="submit" className="rounded-full">
                Subscribe
              </Button>
            </form>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Lennox Lewis. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { StackedCircularFooter };
