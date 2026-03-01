import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shirt, WandSparkles, Luggage, Camera } from "lucide-react";

const features = [
  {
    icon: <Shirt className="h-8 w-8 text-primary" />,
    title: "Dynamic Wardrobe",
    description: "Effortlessly digitize your closet with AI-powered tagging, giving you a perfectly organized overview of every item so you can rediscover forgotten gems.",
  },
  {
    icon: <WandSparkles className="h-8 w-8 text-primary" />,
    title: "AI Outfit Suggestions",
    description: "Get daily outfit ideas tailored to your closet and the weather, saving you time and decision fatigue so you always step out feeling confident.",
  },
  {
    icon: <Camera className="h-8 w-8 text-primary" />,
    title: "Caption AI",
    description: "Transform your outfit photos into perfectly captioned moments with smart AI suggestions designed around your mood and style. Whether it’s chic, edgy, or effortless, your words will match your look every time.",
  },
  {
    icon: <Luggage className="h-8 w-8 text-primary" />,
    title: "Smart Travel Planner",
    description: "Pack perfectly for any trip by letting our AI create a versatile capsule wardrobe from your closet, complete with daily outfit plans.",
  },
];

export default function FeaturesSection() {
  const animate = true;
  return (
    <section id="features" className="w-full py-12 md:py-16 bg-muted/20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-4">
            <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">Key Features</div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl font-headline text-foreground">Everything You Need to Style Smarter</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              From organization to inspiration, SmartDrobe is your all-in-one styling companion.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-2 mt-12">
          {/* Feature 1: Dynamic Wardrobe */}
          <Card
            data-animate={animate}
            style={{ animationDelay: '0ms' }}
            className="data-[animate=true]:animate-fade-in-up hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-none shadow-md"
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                {features[0].icon}
              </div>
              <CardTitle className="text-xl">{features[0].title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{features[0].description}</p>
            </CardContent>
          </Card>

          {/* Feature 2: AI Suggestions */}
          <Card
            data-animate={animate}
            style={{ animationDelay: '150ms' }}
            className="data-[animate=true]:animate-fade-in-up hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-none shadow-md"
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                {features[1].icon}
              </div>
              <CardTitle className="text-xl">{features[1].title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{features[1].description}</p>
            </CardContent>
          </Card>

          {/* Feature 3: Caption AI */}
          <Card
            data-animate={animate}
            style={{ animationDelay: '300ms' }}
            className="data-[animate=true]:animate-fade-in-up hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-none shadow-md"
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                {features[2].icon}
              </div>
              <CardTitle className="text-xl">{features[2].title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{features[2].description}</p>
            </CardContent>
          </Card>

          {/* Feature 4: Travel Planner */}
          <Card
            data-animate={animate}
            style={{ animationDelay: '450ms' }}
            className="data-[animate=true]:animate-fade-in-up hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-none shadow-md"
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                {features[3].icon}
              </div>
              <CardTitle className="text-xl">{features[3].title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{features[3].description}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
