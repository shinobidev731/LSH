import rawHymns from './hymns.json';

export const categories = [
  { id: 1, title: 'PRAISE, WORSHIP & THANKSGIVING', range: '1-34', min: 1, max: 34 },
  { id: 2, title: 'TRINITY', range: '35-41', min: 35, max: 41 },
  { id: 3, title: 'THE LORDS DAY', range: '42-57', min: 42, max: 57 },
  { id: 4, title: 'EVENTIDE', range: '58-65', min: 58, max: 65 },
  { id: 5, title: 'CHRISTMAS', range: '66-76', min: 66, max: 76 },
  { id: 6, title: 'THE WORD OF GOD', range: '77-86', min: 77, max: 86 },
  { id: 7, title: 'THE GOSPEL MESSAGE INVITATION', range: '87-118', min: 87, max: 118 },
  { id: 8, title: 'HOLY GHOST & PENTECOSTAL REVIVAL', range: '119-131', min: 119, max: 131 },
  { id: 9, title: 'PRAYER, FAITH & ENCOURAGEMENT', range: '132-163', min: 132, max: 163 },
  { id: 10, title: 'LENT, REPENTANCE & GROWTH IN GRACE', range: '164-193', min: 164, max: 193 },
  { id: 11, title: 'CONFLICT & VICTORY', range: '194-219', min: 194, max: 219 },
  { id: 12, title: 'CONSECRATION', range: '220-230', min: 220, max: 230 },
  { id: 13, title: 'HOLY COMMUNION', range: '231-237', min: 231, max: 237 },
  { id: 14, title: 'LOVE', range: '238-249', min: 238, max: 249 },
  { id: 15, title: 'BAPTISM', range: '250-255', min: 250, max: 255 },
  { id: 16, title: 'CHRISTIAN MARRIAGE & FAMILY', range: '256-260', min: 256, max: 260 },
  { id: 17, title: 'FELLOWSHIP', range: '261', min: 261, max: 261 },
  { id: 18, title: 'DIVINE PROTECTION & GUIDANCE', range: '262-267', min: 262, max: 267 },
  { id: 19, title: 'CHRISTIAN SERVICE', range: '268-293', min: 268, max: 293 },
  { id: 20, title: 'NEW YEAR', range: '294-300', min: 294, max: 300 },
  { id: 21, title: 'THE PASSION, DEATH & RESURRECTION', range: '301-315', min: 301, max: 315 },
  { id: 22, title: 'CHILDREN & YOUTH', range: '316-332', min: 316, max: 332 },
  { id: 23, title: 'SUNDAY SCHOOL', range: '333', min: 333, max: 333 },
  { id: 24, title: 'BUILDING & DEDICATION', range: '334-338', min: 334, max: 338 },
  { id: 25, title: 'CLOSING & FAREWELL', range: '339-344', min: 339, max: 344 },
  { id: 26, title: 'ASPIRATION AFTER HEAVEN', range: '345-402', min: 345, max: 402 }
];

function getCategoryForHymnNumber(num) {
  for (const cat of categories) {
    if (num >= cat.min && num <= cat.max) {
      return { category: cat.title, categoryId: cat.id };
    }
  }
  return { category: 'GENERAL HYMNS', categoryId: 1 };
}

export const hymnData = {
  Index: rawHymns.map((h) => {
    const { category, categoryId } = getCategoryForHymnNumber(h.number);
    return {
      id: h.number,
      hymnId: h.id,
      code: h.code || h.meter || '',
      title: h.englishTitle,
      titleYoruba: h.yorubaTitle,
      category,
      categoryId,
      english: h.english,
      yoruba: h.yoruba,
      sections: h.english?.sections || [],
      sectionsYoruba: h.yoruba?.sections || [],
      verses: (h.english?.sections || []).map((s) => s.text),
      versesYoruba: (h.yoruba?.sections || []).map((s) => s.text),
      pdfPages: h.pdfPages || []
    };
  }),
  Categories: categories
};