// app/(dashboard)/layout.tsx
"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Home,
  FileText,
  Users,
  Settings,
  Bell,
  PanelLeft,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/ui/avatar";
import { AuthProvider } from "@/lib/AuthProvider";
import PrivateRoute from "@/lib/PrivateRoutes";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navLinks = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      href: "/articles",
      label: "Articles",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      href: "/authors",
      label: "Authors",
      icon: <Users className="h-5 w-5" />,
    },
    {
      href: "/settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <AuthProvider>
      {/* <PrivateRoute> */}
        <div className="flex min-h-screen bg-slate-50 text-slate-800">
          {/* Sidebar for Desktop */}
          <aside
            className={`hidden lg:flex flex-col border-r border-slate-200 bg-white shadow-lg p-4 transition-all duration-300 ${
              isSidebarCollapsed ? "w-20" : "w-64"
            }`}
          >
            <div className="flex items-center gap-2 h-16 px-4 mb-4">
              <Menu
                className={`h-6 w-6 text-indigo-600 transition-all duration-300 ${
                  isSidebarCollapsed ? "mx-auto" : ""
                }`}
              />
              {!isSidebarCollapsed && (
                <span className="text-xl font-bold tracking-tight text-slate-900 overflow-hidden whitespace-nowrap">
                  CMS Dashboard
                </span>
              )}
            </div>
            <nav className="flex-1 space-y-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={pathname === link.href ? "secondary" : "ghost"}
                    className={`w-full justify-start gap-3 transition-colors duration-200 ${
                      pathname === link.href
                        ? "text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                        : ""
                    }`}
                  >
                    {link.icon}
                    {!isSidebarCollapsed && (
                      <span className="overflow-hidden whitespace-nowrap">
                        {link.label}
                      </span>
                    )}
                  </Button>
                </Link>
              ))}
            </nav>
            <Button
              variant="ghost"
              className={`mt-auto w-full justify-center transition-transform duration-300 ${
                isSidebarCollapsed ? "rotate-180" : ""
              }`}
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </aside>

          {/* Main Content Area */}
          <div className={`flex-1 flex flex-col transition-all duration-300`}>
            {/* Top Bar */}
            <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-4 shadow-sm md:px-6">
              {/* Mobile Sidebar Toggle */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden">
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="sm:max-w-xs">
                  <nav className="grid gap-6 text-lg font-medium p-4">
                    {/* ... (Mobile navigation remains the same) */}
                    <div className="flex items-center gap-2 h-16 px-4 mb-4">
                      <Menu className="h-6 w-6 text-indigo-600" />
                      <span className="text-xl font-bold tracking-tight text-slate-900">
                        CMS Dashboard
                      </span>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="ml-auto">
                          <X className="h-5 w-5" />
                          <span className="sr-only">Close menu</span>
                        </Button>
                      </SheetTrigger>
                    </div>
                    {navLinks.map((link) => (
                      <Link key={link.href} href={link.href}>
                        <Button
                          variant={
                            pathname === link.href ? "secondary" : "ghost"
                          }
                          className="w-full justify-start gap-3"
                        >
                          {link.icon}
                          <span>{link.label}</span>
                        </Button>
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>

              {/* Top Bar Content */}
              <div className="flex-1">
                <h1 className="text-xl font-semibold">
                  {navLinks.find((link) => link.href === pathname)?.label ||
                    "Dashboard"}
                </h1>
              </div>
              <div className="flex items-center gap-4 ml-auto">
                <Button variant="ghost" size="icon">
                  <Plus className="h-5 w-5 text-indigo-600" />
                  <span className="sr-only">Add New Article</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5 text-slate-600" />
                  <span className="sr-only">Notifications</span>
                </Button>

                {/* User Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 rounded-full"
                    >
                      <Avatar className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                        A
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem>
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center gap-2 w-full"
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link
                        href="/logout"
                        className="flex items-center gap-2 w-full"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Log out</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

            {/* This is where the actual page content will be rendered */}
            <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
          </div>
        </div>
      {/* </PrivateRoute> */}
    </AuthProvider>
  );
}
