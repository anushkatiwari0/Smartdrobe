# **App Name**: **SmartDrobe**

## Core Features:

- Virtual Closet Display: Virtual Closet: Display all clothing items in a responsive grid with AI-generated images, item name, and category.
- Add New Item: "Add New Item" Button: Opens a dialog for item input, triggers AI image generation on submit, and updates the closet grid.
- Daily Style Tip: Daily Style Tip: Displays a fresh, concise AI-generated fashion tip on each page load, leveraging the style-tip-generator tool. Caches tip daily.
- AI Lookbook Generator: AI Lookbook Generator: Generates 2–3 full outfits for a selected occasion (e.g., “Interview”, “Date Night”) using AI (lookbook-generator tool) and displays results in Accordion components.
- AI Outfit Planner: AI Outfit Planner: Suggests a complete outfit with an explanation based on form inputs (Weather, Mood, Occasion, Style Preferences) using the ai-outfit-planner tool.
- Outfit Calendar: Outfit Calendar: Allows users to select a date, add a text note describing an outfit, and highlights dates with saved outfits.
- Social Styling Feed: Social Styling Feed: Community feed where users share a description of their outfit, and AI generates a visual of the look using the image-generator tool; new posts appear at the top of the feed.

## Style Guidelines:

- Primary color: Mid-tone lavender (#B19CD9) to evoke a sense of creativity and fashion, contrasting well with both light and dark backgrounds.
- Background color: Deep lavender-gray (#1A1A25) for the dark theme and soft lavender (#F0E7F8) for the light theme, providing a subtle backdrop.
- Accent color: Usable mid-tone blue (#7FB5FF) for interactive elements and highlights, complementing the lavender tones.
- Headline font: 'Playfair' (serif) for an elegant, fashionable feel. Note: currently only Google Fonts are supported.
- Body & UI font: 'PT Sans' (sans-serif) for clear and readable text. Note: currently only Google Fonts are supported.
- Use clean, minimalist icons to represent clothing categories and actions within the app. Consider using flat design style for a modern look.
- Implement a persistent, collapsible sidebar for navigation. Mobile: Sidebar becomes an off-canvas menu. Use Card components for key visual areas (tips, items, outfit suggestions, etc.).
- Use subtle animations for loading states and transitions to provide a smooth and engaging user experience. Examples include fade-in effects and smooth transitions.
- Brand imagery: Use high quality photos of clothing, models, or lifestyle shots that represent fashion and style. Images should be modern and visually appealing.
- Logo Placement: Prominently display the SmartDrobe logo in the top-left corner of the application with enough spacing around it.