import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, Package, Truck, MapPin } from "lucide-react";

const TrackOrder = () => {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("orderId") || "");
  const [orderStatus, setOrderStatus] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("orderId")) {
      handleTrack();
    }
  }, [searchParams]);

  const handleTrack = () => {
    if (!orderId) return;
    
    // Simulate order tracking - in real app, this would fetch from backend
    const statuses = ["Processing", "Ready for Pickup", "Out for Delivery", "Completed"];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    setOrderStatus(randomStatus);
  };

  const getStatusStep = (status: string) => {
    const steps = ["Processing", "Ready for Pickup", "Out for Delivery", "Completed"];
    return steps.indexOf(status);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-serif font-bold mb-8 text-center">Track Your Order</h1>
          
          <Card className="p-6 mb-8">
            <div className="space-y-4">
              <div>
                <Label htmlFor="orderId">Order ID</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="orderId"
                    placeholder="Enter your order ID (e.g., ORD-1234567890)"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                  />
                  <Button onClick={handleTrack}>Track</Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                You can find your order ID in the confirmation email or SMS we sent you.
              </p>
            </div>
          </Card>

          {orderStatus && (
            <Card className="p-8 animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold mb-2">Order: {orderId}</h2>
                <p className="text-lg text-primary font-medium">Status: {orderStatus}</p>
              </div>

              {/* Status Timeline */}
              <div className="space-y-6">
                {[
                  { label: "Processing", icon: Package, description: "Your order is being prepared" },
                  { label: "Ready for Pickup", icon: MapPin, description: "Order is ready at our store" },
                  { label: "Out for Delivery", icon: Truck, description: "Your flowers are on the way" },
                  { label: "Completed", icon: CheckCircle2, description: "Order has been delivered" },
                ].map((step, index) => {
                  const currentStep = getStatusStep(orderStatus);
                  const isActive = index <= currentStep;
                  const isCurrent = index === currentStep;
                  const Icon = step.icon;

                  return (
                    <div key={step.label} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`h-12 w-12 rounded-full flex items-center justify-center ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        {index < 3 && (
                          <div
                            className={`w-0.5 h-12 mt-2 ${
                              index < currentStep ? "bg-primary" : "bg-border"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <h3
                          className={`font-semibold mb-1 ${
                            isActive ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {step.label}
                        </h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Need help? Contact us at 08179218529 or email support@flowerstalk.com
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TrackOrder;
