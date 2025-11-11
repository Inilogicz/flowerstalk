export interface Location {
  _id: string
  location: string
  amount: number
}

export interface LocationsApiResponse {
  status: boolean
  message: string
  data: Location[]
}