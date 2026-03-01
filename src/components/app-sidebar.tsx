"use client"

import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { MessageSquare, Settings, Plus, Home } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import LLMSelector from "@/components/llm-selector"

export function AppSidebar() {
  const { user } = useUser()
  const [showSettings, setShowSettings] = React.useState(false)

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="border-b h-14 flex items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
           <div className="size-6 bg-primary rounded flex items-center justify-center text-primary-foreground text-xs">P</div>
           <span className="group-data-[collapsible=icon]:hidden">ProductAxis</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Home">
                  <Link href="/">
                    <Home />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive tooltip="Chat">
                  <Link href="/chat">
                    <MessageSquare />
                    <span>Chat</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>History</SidebarGroupLabel>
          <SidebarGroupContent>
             <SidebarMenu>
               <SidebarMenuItem>
                 <SidebarMenuButton className="text-muted-foreground">
                    <Plus className="size-4" />
                    <span>New Chat</span>
                 </SidebarMenuButton>
               </SidebarMenuItem>
               {/* Recent chats could go here */}
               <div className="px-2 py-4 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
                 No recent chats
               </div>
             </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
             <SidebarMenuButton tooltip="Settings" onClick={() => setShowSettings(!showSettings)}>
                <Settings />
                <span>Settings</span>
             </SidebarMenuButton>
             {showSettings && (
               <div className="px-2 py-2 group-data-[collapsible=icon]:hidden animate-in slide-in-from-top-2 duration-200">
                  <div className="px-2 pb-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Model Selection
                  </div>
                  <LLMSelector />
               </div>
             )}
          </SidebarMenuItem>
          <SidebarMenuItem>
             <div className="flex items-center gap-2 px-2 py-1 group-data-[collapsible=icon]:justify-center">
                <div className="size-6 rounded-full bg-muted overflow-hidden">
                   {user?.imageUrl ? <img src={user.imageUrl} alt="Avatar" /> : null}
                </div>
                <div className="flex flex-col group-data-[collapsible=icon]:hidden overflow-hidden">
                   <span className="text-xs font-medium truncate">{user?.fullName || 'User'}</span>
                   <span className="text-[10px] text-muted-foreground truncate">{user?.primaryEmailAddress?.emailAddress}</span>
                </div>
             </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
