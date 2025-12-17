// src/lib/orderActions.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// All valid status values the rider can send to the update endpoint
export type RiderUpdatableStatus = 
  | 'rider_accept_order' 
  | 'rider_pickedup' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled';

/**
 * Updates the status of a specific order via the Rider API.
 * @param orderId The ID of the order to update.
 * @param status The new status to set.
 * @param token The rider's authentication token.
 * @returns Promise<boolean> True on success, false otherwise.
 */
export async function updateOrderStatus(
  orderId: string,
  status: RiderUpdatableStatus,
  token: string
): Promise<boolean> {
  if (!BASE_URL) {
    console.error("Configuration Error: API base URL is missing.");
    return false;
  }

  try {
    let url = `${BASE_URL}/rider/orders/status-update`;
    let body: any = {
      orderId: orderId,
      status: status,
    };

    if (status === 'rider_accept_order') {
      url = `${BASE_URL}/rider/orders/accept-order`;
      body = { orderId: orderId };
    }

    const response = await fetch(url, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok && data.status) {
      return true;
    } else {
      console.error("Failed to update status:", data.message || "Unknown error");
      return false;
    }
  } catch (error) {
    console.error("Network error during status update:", error);
    return false;
  }
}