import type { User } from '@supabase/supabase-js'

interface ProfileCardProps {
  user: User
  profile: {
    id: string
    email: string
    full_name?: string
    avatar_url?: string
    created_at: string
    updated_at: string
  } | null
}

export function ProfileCard({ user, profile }: ProfileCardProps) {
  const userMetadata = user.user_metadata
  const displayName = profile?.full_name || userMetadata?.full_name || 'Welcome!'
  const userEmail = user.email || 'No email'

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="flex items-center space-x-4">
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.full_name || 'User'}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-600">
            {(profile?.full_name || userEmail || 'U')[0].toUpperCase()}
          </div>
        )}
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {displayName}
          </h2>
          <p className="text-sm text-gray-500">{userEmail}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Member since</span>
          <span className="font-medium text-gray-900">
            {new Date(profile?.created_at || user.created_at).toLocaleDateString()}
          </span>
        </div>
        {user.last_sign_in_at && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Last sign in</span>
            <span className="font-medium text-gray-900">
              {new Date(user.last_sign_in_at).toLocaleDateString()}
            </span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Email verified</span>
          <span className={`font-medium ${user.email_confirmed_at ? 'text-green-600' : 'text-yellow-600'}`}>
            {user.email_confirmed_at ? 'Yes' : 'Pending'}
          </span>
        </div>
      </div>
    </div>
  )
}
