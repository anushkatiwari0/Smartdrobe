

import React from 'react';

export default function AboutPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          About SmartDrobe
        </h1>
      </div>
      <div className="space-y-4 text-muted-foreground">
        <p>
          Welcome to SmartDrobe, your AI-powered virtual wardrobe assistant designed to revolutionize the way you think about your clothes.
        </p>
        <p>
          Our mission is to help you rediscover the potential of your own closet, make smarter fashion choices, and embrace sustainability without sacrificing style.
        </p>
        <h2 className="text-2xl font-bold tracking-tight font-headline text-foreground pt-4">Our Features</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Virtual Closet:</strong> Digitize your wardrobe with AI-generated images and smart tagging.</li>
          <li><strong>AI Stylist:</strong> Get daily outfit suggestions based on your items, the weather, and your mood.</li>
          <li><strong>Lookbook Generator:</strong> Create stylish lookbooks for any occasion with a single click.</li>
          <li><strong>Style DNA Analysis:</strong> Understand your personal style profile and get tips to enhance it.</li>
          <li><strong>Sustainability Tracker:</strong> Learn about the carbon footprint of your fashion choices.</li>
          <li><strong>Smart Shopping:</strong> Discover new items that perfectly complement what you already own.</li>
        </ul>
        <p>
          SmartDrobe is more than just an app; it&apos;s a companion for your style journey.
        </p>
      </div>
    </div>
  );
}
