const STEPS = [
  {
    icon: '🔍',
    title: 'Search by area or route',
    body: 'Find listings near you filtered by matatu routes to your workplace.',
  },
  {
    icon: '✅',
    title: 'View verified listings',
    body: 'Every listing shows real costs, verified agents, and freshness status.',
  },
  {
    icon: '💬',
    title: 'Contact directly on WhatsApp',
    body: 'One tap opens a pre-filled WhatsApp message. No sign-up required to browse.',
  },
  {
    icon: '🔒',
    title: 'Secure your holding deposit',
    body: 'Pay a holding deposit via M-Pesa. We hold it in escrow until you move in.',
  },
];

const TRUST_ITEMS = [
  { value: '2,400+', label: 'Active listings' },
  { value: '890',    label: 'Verified agents' },
  { value: '4,200+', label: 'Renters helped' },
  { value: '4.8★',   label: 'Average rating' },
];

export default function HowItWorks() {
  return (
    <>
      {/* How It Works */}
      <section className="px-4 py-6 max-w-2xl mx-auto w-full">
        <h2 className="text-base font-bold text-[#1A202C] mb-4">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className="bg-white border border-[#E2E8F0] rounded-2xl px-4 py-4 flex gap-3"
            >
              <span className="text-2xl leading-none mt-0.5">{step.icon}</span>
              <div>
                <p className="font-semibold text-sm text-[#1A202C] mb-1">{step.title}</p>
                <p className="text-sm text-[#4A5568] leading-snug">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Numbers */}
      <section className="px-4 pb-8 max-w-2xl mx-auto w-full">
        <div className="bg-[#1B5E3B] rounded-2xl px-5 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {TRUST_ITEMS.map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-white text-xl font-bold">{item.value}</p>
              <p className="text-[#a8d5be] text-xs mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
