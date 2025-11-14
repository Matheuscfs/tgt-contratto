import { getSupabase } from '../../lib/supabase'
import { PaintBrushIcon, Squares2X2Icon, MegaphoneIcon, CameraIcon } from '@heroicons/react/24/outline'

const iconMap: Record<string, any> = {
  paint_brush: PaintBrushIcon,
  squares: Squares2X2Icon,
  megaphone: MegaphoneIcon,
  camera: CameraIcon,
}

export async function getCategories() {
  const supabase = getSupabase()
  const { data } = await supabase.from('categories').select('*').order('name')
  return (data ?? []).map((c: any) => ({ id: c.id, name: c.name, icon: iconMap[c.icon] || PaintBrushIcon, imageUrl: c.image_url }))
}
