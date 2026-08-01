import pb from '@/lib/pocketbase/client'

export interface MarketComparativeItem {
  id: string
  neighborhood: string
  city: string
  avg_m2_price: number
  avg_days_on_market: number
  demand_level: 'alta' | 'media' | 'baixa'
  competitor_density?: 'alta' | 'moderada' | 'baixa'
  appreciation_trend?: string
  created?: string
}

export const getMarketComparatives = () =>
  pb.collection('market_comparatives').getFullList<MarketComparativeItem>({ sort: '-created' })

export const createMarketComparative = (data: Partial<MarketComparativeItem>) =>
  pb.collection('market_comparatives').create<MarketComparativeItem>({
    ...data,
    user: pb.authStore.record?.id,
  })
