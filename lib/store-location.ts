export const STORE_ADDRESS = {
  line1: "1A Alhaji Masha Close, off Ademola Street",
  line2: "Awolowo Road, Ikoyi, Lagos",
  full: "1A Alhaji Masha Close, off Ademola Street, Awolowo Road, Ikoyi, Lagos",
}

export const PREVIOUS_ADDRESS = "2 Oyinkan Abayomi Drive, Ikoyi, Lagos"

export const DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE_ADDRESS.full)}`

// Bump the version to show the announcement again to visitors who dismissed it.
export const MOVE_NOTICE_KEY = "flowerstalk-moved-notice-v1"
