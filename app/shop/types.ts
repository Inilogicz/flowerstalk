export interface ApiProduct {
  _id: string
  name: string
  price: number
  description: string
  category: string
  imageUrl: string
  stock: number
  createdAt: string
  updatedAt: string
  __v: number
  originalPrice?: number
  rating?: number
  reviews?: number
  badge?: string
}

export interface ApiResponse {
  status: string
  message: string
  data: ApiProduct[]
  pagination: {
    totalItems: number
    totalPages: number
    currentPage: number
    pageSize: number
  }
}