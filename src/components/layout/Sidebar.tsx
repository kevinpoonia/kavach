import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  MessageSquare,
  Brain,
  Reply,
  Rocket,
  GitBranch,
  QrCode,
  Users,
  Bell,
  BarChart3,
  Wrench,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: MessageSquare, label: 'Review Feed', path: '/reviews', badge: 12 },
  { icon: Brain, label: 'AI Insights', path: '/insights' },
  { icon: Reply, label: 'Response Center', path: '/responses' },
  { icon: Rocket, label: 'Review Funnels', path: '/funnels' },
  { icon: GitBranch, label: 'Smart Routing', path: '/routing' },
  { icon: QrCode, label: 'QR & Campaigns', path: '/campaigns' },
  { icon: Users, label: 'Competitors', path: '/competitors' },
  { icon: Bell, label: 'Alerts', path: '/alerts', badge: 3 },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Users, label: 'Team', path: '/team' },
  { icon: Wrench, label: 'AI Tools', path: '/ai-tools' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-info flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-lg text-sidebar-foreground">Kavach</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={cn(
                    'sidebar-item group relative',
                    isActive && 'active'
                  )}
                >
                  <item.icon className={cn(
                    'w-5 h-5 flex-shrink-0',
                    isActive ? 'text-sidebar-primary-foreground' : 'text-sidebar-foreground/70 group-hover:text-sidebar-foreground'
                  )} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-sm font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="bg-accent text-accent-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {collapsed && item.badge && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="sidebar-item w-full justify-center"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-sidebar-foreground/70" />
          ) : (
            <Sun className="w-5 h-5 text-sidebar-foreground/70" />
          )}
          {!collapsed && (
            <span className="text-sm text-sidebar-foreground/70">
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </span>
          )}
        </button>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="sidebar-item w-full justify-center"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-sidebar-foreground/70" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 text-sidebar-foreground/70" />
              <span className="text-sm text-sidebar-foreground/70">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
