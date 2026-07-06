import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { LogoutButton } from '@/components/LogoutButton'
import { ProfileCard } from '@/components/ProfileCard'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectTo=/dashboard')
  }

  // Get profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Dashboard
            </h1>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <ProfileCard user={user} profile={profile} />

          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <a
                href="/settings"
                className="block rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50"
              >
                <h3 className="font-medium text-gray-900">Account Settings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Update your profile and preferences
                </p>
              </a>
              <a
                href="/settings/security"
                className="block rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50"
              >
                <h3 className="font-medium text-gray-900">Security</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your password and security settings
                </p>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Session Information
          </h2>
          <div className="overflow-x-auto">
            <pre className="rounded bg-gray-50 p-4 text-sm text-gray-700">
              {JSON.stringify(
                {
                  id: user.id,
                  email: user.email || 'No email',
                  created_at: user.created_at,
                  last_sign_in_at: user.last_sign_in_at || 'Never',
                  email_confirmed_at: user.email_confirmed_at || 'Not confirmed',
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </main>
    </div>
  )
}
