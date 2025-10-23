import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [paymentMethod, setPaymentMethod] = useState("online");
  const deliveryFee = deliveryMethod === "delivery" ? (subtotal > 10000 ? 0 : 2000) : 0;
  const total = subtotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = `ORD-${Date.now()}`;
    
    // Simulate order processing
    toast.success(`Order ${orderId} placed successfully! Check your email for confirmation.`);
    clearCart();
    
    // Navigate to track order page with the order ID
    navigate(`/track?orderId=${orderId}`);
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif font-bold mb-8">Checkout</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" required />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="08012345678" required />
                  </div>
                </div>
              </Card>

              {/* Delivery Method */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Delivery Method</h2>
                <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod} className="space-y-3">
                  <div className="flex items-center space-x-2 border border-border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                      <div className="font-medium">Home Delivery</div>
                      <div className="text-sm text-muted-foreground">Get it delivered to your doorstep</div>
                    </Label>
                    <span className="font-medium">
                      {subtotal > 0 && subtotal > 10000? "Free" : "₦2,000"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 border border-border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                      <div className="font-medium">Store Pickup</div>
                      <div className="text-sm text-muted-foreground">Pick up from our Lagos or Abuja store</div>
                    </Label>
                    <span className="font-medium text-secondary">Free</span>
                  </div>
                </RadioGroup>
              </Card>

              {/* Delivery Address */}
              {deliveryMethod === "delivery" && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Street Address</Label>
                      <Input id="address" placeholder="123 Main Street" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" placeholder="Lagos" required />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input id="state" placeholder="Lagos" required />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                      <Textarea 
                        id="notes" 
                        placeholder="Add any special delivery instructions..."
                        rows={3}
                      />
                    </div>
                  </div>
                </Card>
              )}

              {/* Payment Method */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                  <div className="flex items-center space-x-2 border border-border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online" className="flex-1 cursor-pointer">
                      <div className="font-medium">Pay Online</div>
                      <div className="text-sm text-muted-foreground">Pay securely with card or bank transfer</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border border-border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="pickup-pay" id="pickup-pay" />
                    <Label htmlFor="pickup-pay" className="flex-1 cursor-pointer">
                      <div className="font-medium">Pay on Pickup/Delivery</div>
                      <div className="text-sm text-muted-foreground">Pay when you receive your order</div>
                    </Label>
                  </div>
                </RadioGroup>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} × {item.quantity}
                      </span>
                      <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span>{deliveryFee === 0 ? "3900" : `₦${deliveryFee.toLocaleString()}`}</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-primary">₦{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full mb-4" size="lg">
                  Complete Order
                </Button>

                <div className="text-xs text-center text-muted-foreground">
                  By completing your order, you agree to our Terms & Conditions
                </div>
              </Card>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
