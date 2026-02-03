import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { teamMembers, UserRole } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  UserPlus, 
  Mail, 
  Clock, 
  MessageSquare, 
  MoreVertical,
  Shield,
  Search
} from 'lucide-react';

const roleColors: Record<UserRole, string> = {
  admin: 'bg-accent/10 text-accent',
  support: 'bg-info/10 text-info',
  hr: 'bg-success/10 text-success',
  legal: 'bg-destructive/10 text-destructive',
  marketing: 'bg-warning/10 text-warning',
};

const roleLabels: Record<UserRole, string> = {
  admin: 'Admin',
  support: 'Support',
  hr: 'HR',
  legal: 'Legal',
  marketing: 'Marketing',
};

export default function Team() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');

  const filteredMembers = teamMembers.filter(member => {
    if (searchQuery && !member.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedRole !== 'all' && member.role !== selectedRole) return false;
    return true;
  });

  const roleStats = Object.entries(
    teamMembers.reduce((acc, member) => {
      acc[member.role] = (acc[member.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  );

  return (
    <MainLayout>
      <Header 
        title="Team Management" 
        subtitle="Manage team members and permissions"
      />
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="card-elevated p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{teamMembers.length}</p>
            <p className="text-sm text-muted-foreground">Total Members</p>
          </div>
          {roleStats.map(([role, count]) => (
            <div key={role} className="card-elevated p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{count}</p>
              <p className="text-sm text-muted-foreground capitalize">{role}</p>
            </div>
          ))}
        </div>

        {/* Filters & Actions */}
        <div className="card-elevated p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-search w-full pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedRole('all')}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  selectedRole === 'all' ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
                )}
              >
                All Roles
              </button>
              {Object.entries(roleLabels).map(([role, label]) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role as UserRole)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    selectedRole === role 
                      ? roleColors[role as UserRole] 
                      : 'bg-secondary text-muted-foreground hover:text-foreground'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <Button className="btn-gradient gap-2 ml-auto">
              <UserPlus className="w-4 h-4" />
              Add Member
            </Button>
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <div key={member.id} className="card-elevated p-5 group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">{member.name}</h4>
                    <span className={cn(
                      'inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1',
                      roleColors[member.role]
                    )}>
                      {roleLabels[member.role]}
                    </span>
                  </div>
                </div>
                <button className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-secondary transition-all">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{member.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="text-xs">Reviews Handled</span>
                  </div>
                  <p className="font-semibold text-foreground">{member.reviewsHandled}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs">Avg Response</span>
                  </div>
                  <p className="font-semibold text-foreground">{member.avgResponseTime}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Permissions Info */}
        <div className="card-elevated p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-foreground">Role Permissions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(roleLabels).map(([role, label]) => (
              <div key={role} className="p-4 rounded-lg bg-secondary/50">
                <span className={cn(
                  'inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2',
                  roleColors[role as UserRole]
                )}>
                  {label}
                </span>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {role === 'admin' && (
                    <>
                      <li>• Full access to all features</li>
                      <li>• Manage team members</li>
                      <li>• Configure integrations</li>
                    </>
                  )}
                  {role === 'support' && (
                    <>
                      <li>• View and respond to reviews</li>
                      <li>• Access response templates</li>
                      <li>• Escalate issues</li>
                    </>
                  )}
                  {role === 'hr' && (
                    <>
                      <li>• Manage employee reviews</li>
                      <li>• Access Glassdoor data</li>
                      <li>• Create HR reports</li>
                    </>
                  )}
                  {role === 'legal' && (
                    <>
                      <li>• Handle escalated reviews</li>
                      <li>• Access legal templates</li>
                      <li>• Manage sensitive cases</li>
                    </>
                  )}
                  {role === 'marketing' && (
                    <>
                      <li>• View analytics</li>
                      <li>• Create campaigns</li>
                      <li>• Manage public responses</li>
                    </>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
