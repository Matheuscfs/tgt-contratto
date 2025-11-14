export type Role = 'client' | 'company'

export interface Location {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
}

export interface Service {
  id: string
  name: string
  description: string
  price: string
  detailedDescription?: string
  imageUrl?: string
}

export interface Review {
  id: string
  author: string
  date: string
  rating: number
  comment: string
}

export interface Company {
  id: string
  name: string
  category: string
  description: string
  rating: number
  reviewCount: number
  isFeatured?: boolean
  isFavorite?: boolean
  specialties: string[]
  location: Location
  logoUrl: string
  coverUrl: string
  phone?: string
  services: Service[]
  portfolio: string[]
  reviews: Review[]
}

import type { ComponentType } from 'react'

export interface Category {
  id: string
  name: string
  icon: ComponentType<any>
  imageUrl?: string
  slug?: string
}

export interface Quote {
  id: string
  status: 'Solicitado' | 'Respondido' | 'Concluído' | 'Cancelado'
  companyName: string
  serviceName?: string
  createdAt: string
}

export interface Conversation {
  id: string
  companyName: string
  companyLogoUrl: string
  onlineStatus?: string
  messages: Message[]
}

export interface Message {
  id: string
  sender: 'user' | 'company'
  text: string
  timestamp: string
}

export interface Subscription {
  planName: string
  status: string
  price: number
  renewalDate: string
  paymentMethod: { brand: string; last4: string }
  billingHistory: { id: string; date: string; amount: string; status: string }[]
}
