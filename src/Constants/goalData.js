export const goalData = {
  protein: {
    tag: 'SUPPLEMENTS',
    title: 'PROTEIN POWDERS',
    sub: 'Your personalized shopping checklist',
    sections: [
      {
        label: '💪 MUST HAVE',
        items: [
          { id: 'p1', name: 'Whey Protein 5lb', desc: 'Optimum Nutrition Gold Standard — best overall value', price: 74, priority: 'must' },
          { id: 'p2', name: 'Casein Protein 4lb', desc: 'Slow-release for overnight muscle recovery', price: 65, priority: 'must' },
        ]
      },
      {
        label: '⚡ NICE TO HAVE',
        items: [
          { id: 'p3', name: 'Plant Protein 2lb', desc: 'MyProtein vegan blend for dairy-free days', price: 42, priority: 'nice' },
          { id: 'p4', name: 'Protein Bars (×12)', desc: 'Quest Bars — 20g protein, low sugar, great taste', price: 36, priority: 'nice' },
        ]
      },
      {
        label: '🧪 OPTIONAL UPGRADES',
        items: [
          { id: 'p5', name: 'Collagen Peptides', desc: 'Joint support + skin health bonus', price: 28, priority: 'optional' },
          { id: 'p6', name: 'Protein Shaker (×2)', desc: 'BlenderBottle Pro — leak proof, easy clean', price: 18, priority: 'optional' },
        ]
      }
    ]
  },
  preworkout: {
    tag: 'PERFORMANCE',
    title: 'PRE-WORKOUT',
    sub: 'Fuel your training sessions',
    sections: [
      {
        label: '💪 MUST HAVE',
        items: [
          { id: 'pw1', name: 'C4 Original Pre-Workout', desc: 'Best-seller, great energy + focus', price: 39, priority: 'must' },
          { id: 'pw2', name: 'Creatine Monohydrate 500g', desc: 'MyProtein — proven strength & power gains', price: 22, priority: 'must' },
        ]
      },
      {
        label: '⚡ NICE TO HAVE',
        items: [
          { id: 'pw3', name: 'Beta-Alanine 500g', desc: 'Reduces fatigue, improves endurance', price: 19, priority: 'nice' },
          { id: 'pw4', name: 'Caffeine Pills (×100)', desc: 'Clean energy without sugar crash', price: 12, priority: 'nice' },
        ]
      },
      {
        label: '🧪 OPTIONAL UPGRADES',
        items: [
          { id: 'pw5', name: 'BCAA Powder 400g', desc: 'Intra-workout amino acids for muscle preservation', price: 29, priority: 'optional' },
        ]
      }
    ]
  },
  accessories: {
    tag: 'GYM GEAR',
    title: 'GYM ACCESSORIES',
    sub: 'Essential gear for every session',
    sections: [
      {
        label: '💪 MUST HAVE',
        items: [
          { id: 'ac1', name: 'Gym Gloves', desc: 'Grip & palm protection for heavy lifting', price: 18, priority: 'must' },
          { id: 'ac2', name: 'Lifting Belt', desc: 'Core support for squats and deadlifts', price: 45, priority: 'must' },
          { id: 'ac3', name: 'Resistance Bands Set', desc: 'Fit Simplify 5-pack — warm-up & activation', price: 18, priority: 'must' },
        ]
      },
      {
        label: '⚡ NICE TO HAVE',
        items: [
          { id: 'ac4', name: 'Foam Roller', desc: 'TriggerPoint GRID — deep muscle recovery', price: 35, priority: 'nice' },
          { id: 'ac5', name: 'Jump Rope (speed)', desc: 'RPM Speed Cable — cardio warm-up essential', price: 22, priority: 'nice' },
          { id: 'ac6', name: 'Gym Bag 30L', desc: 'Nike Hoops Elite — fits everything + shoes pocket', price: 55, priority: 'nice' },
        ]
      },
      {
        label: '🧪 OPTIONAL UPGRADES',
        items: [
          { id: 'ac7', name: 'Wrist Wraps', desc: 'Heavy press support, pairs with gloves', price: 14, priority: 'optional' },
        ]
      }
    ]
  },
  apparel: {
    tag: 'CLOTHING',
    title: 'FITNESS APPAREL',
    sub: 'Look the part, feel the part, perform the part',
    sections: [
      {
        label: '👕 MUST HAVE',
        items: [
          { id: 'ap1', name: 'Training T-Shirts (×3)', desc: 'Moisture-wicking fabric — Nike Dri-FIT or Gymshark', price: 75, priority: 'must' },
          { id: 'ap2', name: 'Training Shorts (×2)', desc: '5" inseam flex shorts with liner for gym days', price: 60, priority: 'must' },
          { id: 'ap3', name: 'Training Shoes', desc: 'Nike Air Zoom SuperRep 3 — flat sole for lifting stability', price: 110, priority: 'must' },
        ]
      },
      {
        label: '⚡ NICE TO HAVE',
        items: [
          { id: 'ap4', name: 'Compression Leggings', desc: 'Adidas Techfit — great for leg day and recovery', price: 45, priority: 'nice' },
          { id: 'ap5', name: 'Training Hoodie', desc: 'Adidas Essentials — warm-up and post-session wear', price: 65, priority: 'nice' },
        ]
      },
      {
        label: '🧪 OPTIONAL UPGRADES',
        items: [
          { id: 'ap6', name: 'Compression Socks (×3)', desc: 'Improves circulation for long training sessions', price: 22, priority: 'optional' },
        ]
      }
    ]
  }
}
export default goalData;;