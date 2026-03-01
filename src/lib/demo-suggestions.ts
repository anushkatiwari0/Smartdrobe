
export type OutfitSuggestion = {
    image: string;
    text: string;
    hint: string;
};

export const demoSuggestions: OutfitSuggestion[] = [
    {
        image: 'https://picsum.photos/seed/fashion1/600/800',
        text: 'A chic, modern look for city exploring. Pair a silk blouse with tailored trousers.',
        hint: 'modern fashion',
    },
    {
        image: 'https://picsum.photos/seed/fashion2/600/800',
        text: 'Effortless weekend style. A classic denim jacket over a simple white dress.',
        hint: 'casual fashion',
    },
    {
        image: 'https://picsum.photos/seed/fashion3/600/800',
        text: 'Perfect for a brunch date. A flowy floral skirt matched with a cropped knit top.',
        hint: 'brunch outfit',
    },
    {
        image: 'https://picsum.photos/seed/fashion4/600/800',
        text: 'Cozy and stylish for a cool day. A chunky turtleneck sweater and dark-wash jeans.',
        hint: 'autumn fashion',
    },
    {
        image: 'https://picsum.photos/seed/fashion5/600/800',
        text: 'Ready for a night out. A sleek black jumpsuit with statement gold accessories.',
        hint: 'night out outfit',
    },
];
