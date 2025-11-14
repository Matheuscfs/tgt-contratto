import { Category } from '../types/domain'
import { PaintBrushIcon, Squares2X2Icon, MegaphoneIcon, CameraIcon } from '@heroicons/react/24/outline'

export const CATEGORIES: Category[] = [
  { id: 'painting', name: 'Pintura', icon: PaintBrushIcon },
  { id: 'floor', name: 'Piso', icon: Squares2X2Icon },
  { id: 'marketing', name: 'Marketing', icon: MegaphoneIcon },
  { id: 'photography', name: 'Fotografia', icon: CameraIcon },
]
