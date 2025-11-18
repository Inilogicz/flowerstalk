export interface Location {
  _id: string
  location: string
  amount?: number
  type: "delivery" | "pickup"
  address?: string
}

export interface LocationsApiResponse {
  status: boolean
  message: string
  data: Location[]
}