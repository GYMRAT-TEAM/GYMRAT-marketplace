const goalData = {
  muscle: {
    tag: 'Bulking',
    title: 'BUILD MUSCLE',
    sub: 'Everything you need to pack on serious size',
    sections: [
      {
        label: 'Must Have',
        items: [
          { id: 'muscle-1', name: 'Whey Protein (5lb)', desc: 'Optimum Nutrition Gold Standard — fast-absorbing post-workout', price: 'DZA 1000', priority: 'must' },
          { id: 'muscle-2', name: 'Creatine Monohydrate', desc: 'Pure micronized creatine for strength and power output', price: 'DZA 28', priority: 'must' },
          { id: 'muscle-3', name: 'Weight Gainer (6lb)', desc: 'High-calorie mass gainer for hard gainers', price: 'DZA 55', priority: 'must' },
        ],
      },
      {
        label: 'Nice To Have',
        items: [
          { id: 'muscle-4', name: 'Pre-Workout', desc: 'Explosive energy and focus for heavy lifting sessions', price: 'DZA 38', priority: 'nice' },
          { id: 'muscle-5', name: 'ZMA (Zinc & Magnesium)', desc: 'Boosts testosterone and improves sleep quality', price: 'DZA 22', priority: 'nice' },
          { id: 'muscle-6', name: 'Lifting Belt', desc: 'Protect your lower back during heavy compound lifts', price: 'DZA 45', priority: 'nice' },
        ],
      },
      {
        label: 'Optional',
        items: [
          { id: 'muscle-7', name: 'Wrist Wraps', desc: 'Extra wrist support for pressing movements', price: 'DZA 18', priority: 'opt' },
          { id: 'muscle-8', name: 'Blender Bottle', desc: 'BPA-free shaker for on-the-go mixing', price: 'DZA 14', priority: 'opt' },
        ],
      },
    ],
  },

  fat: {
    tag: 'Cutting',
    title: 'BURN FAT',
    sub: 'Torch body fat while preserving lean muscle',
    sections: [
      {
        label: 'Must Have',
        items: [
          { id: 'fat-1', name: 'Whey Isolate (4lb)', desc: 'Low-carb, low-fat protein to stay lean and full', price: 'DZA 68', priority: 'must' },
          { id: 'fat-2', name: 'Fat Burner Capsules', desc: 'Thermogenic formula to boost metabolism and energy', price: 'DZA 35', priority: 'must' },
          { id: 'fat-3', name: 'L-Carnitine', desc: 'Transports fatty acids into cells for energy production', price: 'DZA 24', priority: 'must' },
        ],
      },
      {
        label: 'Nice To Have',
        items: [
          { id: 'fat-4', name: 'CLA Softgels', desc: 'Conjugated linoleic acid for body composition support', price: 'DZA 22', priority: 'nice' },
          { id: 'fat-5', name: 'Green Tea Extract', desc: 'Natural antioxidant that supports fat oxidation', price: 'DZA 16', priority: 'nice' },
          { id: 'fat-6', name: 'Resistance Bands Set', desc: 'Lightweight training anywhere — great for cardio circuits', price: 'DZA 28', priority: 'nice' },
        ],
      },
    ],
  },

  strength: {
    tag: 'Performance',
    title: 'STRENGTH & POWER',
    sub: 'Build raw strength and dominate every lift',
    sections: [
      {
        label: 'Must Have',
        items: [
          { id: 'str-1', name: 'Creatine Monohydrate (500g)', desc: 'The most researched supplement for strength gains', price: 'DZA 28', priority: 'must' },
          { id: 'str-2', name: 'Pre-Workout (Stim)', desc: 'High-stimulant formula for maximum performance', price: 'DZA 42', priority: 'must' },
          { id: 'str-3', name: 'Powerlifting Belt', desc: 'Thick leather belt for squat, deadlift and bench support', price: 'DZA 89', priority: 'must' },
        ],
      },
      {
        label: 'Nice To Have',
        items: [
          { id: 'str-4', name: 'Knee Sleeves', desc: 'Compression support and warmth for heavy squats', price: 'DZA 38', priority: 'nice' },
          { id: 'str-5', name: 'Chalk Block', desc: 'Improves grip on deadlifts and pull movements', price: 'DZA 12', priority: 'nice' },
          { id: 'str-6', name: 'Wrist Wraps (Heavy)', desc: 'Rigid support for max-effort pressing', price: 'DZA 22', priority: 'nice' },
        ],
      },
      {
        label: 'Optional',
        items: [
          { id: 'str-7', name: 'Beta-Alanine', desc: 'Reduces muscle fatigue during high-intensity sets', price: 'DZA 19', priority: 'opt' },
        ],
      },
    ],
  },

  endurance: {
    tag: 'Cardio',
    title: 'ENDURANCE TRAINING',
    sub: 'Go longer, recover faster, perform better',
    sections: [
      {
        label: 'Must Have',
        items: [
          { id: 'end-1', name: 'Electrolyte Powder', desc: 'Replenish sodium, potassium and magnesium during long sessions', price: 'DZA 26', priority: 'must' },
          { id: 'end-2', name: 'BCAA Powder', desc: 'Prevent muscle breakdown during extended cardio', price: 'DZA 32', priority: 'must' },
          { id: 'end-3', name: 'Running Shoes', desc: 'Cushioned, responsive shoe built for distance running', price: 'DZA 120', priority: 'must' },
        ],
      },
      {
        label: 'Nice To Have',
        items: [
          { id: 'end-4', name: 'Caffeine Tablets', desc: 'Clean energy boost without the crash', price: 'DZA 12', priority: 'nice' },
          { id: 'end-5', name: 'Compression Socks', desc: 'Reduce leg fatigue and improve circulation', price: 'DZA 18', priority: 'nice' },
        ],
      },
    ],
  },

  flexibility: {
    tag: 'Mobility',
    title: 'FLEXIBILITY & MOBILITY',
    sub: 'Move better, feel better, prevent injury',
    sections: [
      {
        label: 'Must Have',
        items: [
          { id: 'flex-1', name: 'Yoga Mat (6mm)', desc: 'Non-slip thick mat for stretching and floor work', price: 'DZA 34', priority: 'must' },
          { id: 'flex-2', name: 'Foam Roller', desc: 'Deep tissue massage for tight muscles and fascia', price: 'DZA 28', priority: 'must' },
          { id: 'flex-3', name: 'Resistance Bands Set', desc: 'Assisted stretching and mobility drills', price: 'DZA 22', priority: 'must' },
        ],
      },
      {
        label: 'Nice To Have',
        items: [
          { id: 'flex-4', name: 'Massage Gun', desc: 'Percussive therapy for deep muscle release', price: 'DZA 89', priority: 'nice' },
          { id: 'flex-5', name: 'Collagen Peptides', desc: 'Supports joint health and connective tissue', price: 'DZA 32', priority: 'nice' },
          { id: 'flex-6', name: 'Stretching Strap', desc: 'Assisted deep stretching for hamstrings and hips', price: 'DZA 14', priority: 'nice' },
        ],
      },
    ],
  },

  recovery: {
    tag: 'Wellness',
    title: 'RECOVERY & WELLNESS',
    sub: 'Sleep deeper, recover faster, feel your best',
    sections: [
      {
        label: 'Must Have',
        items: [
          { id: 'rec-1', name: 'Whey Protein (5lb)', desc: 'Post-workout protein to kickstart muscle repair', price: 'DZA 74', priority: 'must' },
          { id: 'rec-2', name: 'Magnesium Glycinate', desc: 'Improves sleep quality and reduces muscle cramps', price: 'DZA 22', priority: 'must' },
          { id: 'rec-3', name: 'Omega-3 Fish Oil', desc: 'Reduces inflammation and supports joint recovery', price: 'DZA 26', priority: 'must' },
        ],
      },
      {
        label: 'Nice To Have',
        items: [
          { id: 'rec-4', name: 'Foam Roller', desc: 'Daily soft tissue work to flush out soreness', price: 'DZA 28', priority: 'nice' },
          { id: 'rec-5', name: 'Epsom Salt (2kg)', desc: 'Magnesium soak bath for full-body muscle relief', price: 'DZA 14', priority: 'nice' },
          { id: 'rec-6', name: 'Massage Gun', desc: 'Targeted percussion therapy for deep recovery', price: 'DZA 89', priority: 'nice' },
        ],
      },
      {
        label: 'Optional',
        items: [
          { id: 'rec-7', name: 'Melatonin (5mg)', desc: 'Regulate sleep cycles for deeper recovery', price: 'DZA 12', priority: 'opt' },
          { id: 'rec-8', name: 'Vitamin D3 + K2', desc: 'Immune support and bone health year-round', price: 'DZA 18', priority: 'opt' },
          { id: 'rec-9', name: 'Sleep Mask', desc: 'Block light for uninterrupted deep sleep', price: 'DZA 16', priority: 'opt' },
        ],
      },
    ],
  },
};

export default goalData;