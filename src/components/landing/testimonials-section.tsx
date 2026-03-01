
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Jessica L.",
    role: "Marketing Manager",
    avatar: "https://picsum.photos/seed/person1/100",
    avatarHint: "woman smiling",
    text: "SmartDrobe saved me so much time getting ready in the morning. The AI suggestions are surprisingly spot-on!",
    rating: 5,
  },
  {
    name: "Mike R.",
    role: "Creative Director",
    avatar: "https://picsum.photos/seed/person2/100",
    avatarHint: "man with glasses",
    text: "As a visual person, being able to see my whole wardrobe on my phone is a game-changer for planning creative outfits.",
    rating: 5,
  },
  {
    name: "Samantha K.",
    role: "Fashion Blogger",
    avatar: "https://picsum.photos/seed/person3/100",
    avatarHint: "woman in sunglasses",
    text: "I love the sustainability feature. It's helped me become a more conscious consumer and make better choices.",
    rating: 4,
  },
];

export default function TestimonialsSection() {
    const animate = true;
  return (
    <section className="w-full py-12 md:py-16 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Loved by Fashion Lovers</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            See what our early adopters are saying about their new favorite wardrobe assistant.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-3 gap-8 pt-12">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              data-animate={animate} 
              style={{ animationDelay: `${index * 200}ms` }}
              className="data-[animate=true]:animate-slide-up-fade"
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Avatar className="w-20 h-20 mb-4 border-2 border-primary/50">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.avatarHint} />
                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                <div className="mt-4">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
                <div className="flex mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
