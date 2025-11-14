import { getSupabase } from '../../lib/supabase'

export async function getNotifications() {
  const supabase = getSupabase()
  const { data: user } = await supabase.auth.getUser()
  const userId = user.user?.id
  if (!userId) return []
  const { data } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return data ?? []
}
