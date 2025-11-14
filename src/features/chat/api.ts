import { getSupabase } from '../../lib/supabase'

export async function listMessages(conversationId: string) {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
  return data ?? []
}

export async function sendMessage(conversationId: string, sender: 'client'|'company', text: string) {
  const supabase = getSupabase()
  await supabase.from('messages').insert({ conversation_id: conversationId, sender, text })
}

export function subscribeMessages(conversationId: string, onNew: (msg: any) => void) {
  const supabase = getSupabase()
  return supabase
    .channel('messages')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` }, (payload) => {
      onNew(payload.new)
    })
    .subscribe()
}
