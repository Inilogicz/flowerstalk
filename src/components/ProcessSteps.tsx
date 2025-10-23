import { Flower2, ShoppingBag, Truck, CreditCard, MapPin } from 'lucide-react';

const steps = [
  {
    icon: Flower2,
    title: 'Choose Flower',
    description: 'Browse our beautiful collection of fresh flowers and arrangements',
    color: 'from-rose-400 to-pink-400',
  },
  {
    icon: ShoppingBag,
    title: 'Select Type',
    description: 'Pick your favorite bouquet or custom arrangement',
    color: 'from-pink-400 to-fuchsia-400',
  },
  {
    icon: MapPin,
    title: 'Order Method',
    description: 'Choose pickup from store or delivery to your location',
    color: 'from-fuchsia-400 to-purple-400',
  },
  {
    icon: CreditCard,
    title: 'Make Payment',
    description: 'Secure online payment or pay on pickup',
    color: 'from-purple-400 to-indigo-400',
  },
  {
    icon: Truck,
    title: 'Track Order',
    description: 'Monitor your order status in real-time',
    color: 'from-indigo-400 to-blue-400',
  },
];

export default function ProcessSteps() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fadeIn">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Simple and seamless process to get your beautiful flowers delivered
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="group relative animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent -z-10"></div>
                  )}

                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300`}></div>
                    <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                      <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-600 text-center">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
