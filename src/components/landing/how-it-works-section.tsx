
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  {
    step: "01",
    title: "Upload Your Closet",
    description: "Snap photos of your clothes or add them manually. Our AI will tag and organize everything for you.",
  },
  {
    step: "02",
    title: "Get AI Suggestions",
    description: "Receive daily outfit ideas based on your wardrobe, the weather, and your personal style.",
  },
  {
    step: "03",
    title: "Plan & Style",
    description: "Mix and match items virtually, plan your outfits for the week, and discover new ways to wear your clothes.",
  },
];

export default function HowItWorksSection() {
  const animate = true;
  return (
    <section className="w-full py-12 md:py-16 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">How It Works</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Styling your wardrobe has never been easier.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 pt-12 sm:grid-cols-3">
          {steps.map((step, index) => (
            <Card 
              key={index} 
              data-animate={animate} 
              style={{ animationDelay: `${index * 150}ms` }}
              className="data-[animate=true]:animate-fade-in-up text-center"
            >
              <CardHeader>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-3xl font-bold text-primary">{step.step}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <CardTitle className="text-xl font-headline">{step.title}</CardTitle>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
