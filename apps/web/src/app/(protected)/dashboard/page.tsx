'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">
            Welcome, {user.firstName}!
          </h2>

          <div className="p-6 rounded-lg border bg-card">
            <h3 className="font-semibold mb-4">Your Profile</h3>
            <dl className="space-y-2">
              <div className="flex">
                <dt className="w-32 text-muted-foreground">Name:</dt>
                <dd>{user.firstName} {user.lastName}</dd>
              </div>
              <div className="flex">
                <dt className="w-32 text-muted-foreground">Email:</dt>
                <dd>{user.email}</dd>
              </div>
              <div className="flex">
                <dt className="w-32 text-muted-foreground">Role:</dt>
                <dd className="capitalize">{user.role.toLowerCase()}</dd>
              </div>
              <div className="flex">
                <dt className="w-32 text-muted-foreground">Status:</dt>
                <dd className="capitalize">{user.status.toLowerCase().replace('_', ' ')}</dd>
              </div>
              <div className="flex">
                <dt className="w-32 text-muted-foreground">Joined:</dt>
                <dd>{new Date(user.createdAt).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 p-6 rounded-lg border bg-card">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="flex gap-4">
              <Button variant="outline">Edit Profile</Button>
              <Button variant="outline">Change Password</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
