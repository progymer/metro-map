
const PRICING_TIERS = [
  { maxStops: 9, price: 10 },
  { maxStops: 16, price: 12 },
  { maxStops: Infinity, price: 15 },
];

const Pricing = (totalStations: number): number => {
  return PRICING_TIERS.find((tier) => totalStations <= tier.maxStops)!.price;
};

export default Pricing;