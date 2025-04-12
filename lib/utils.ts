import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Icons from "@/components/global/icons";
import { 
  Home,
  Wrench,
  ShowerHead,
  UtensilsCrossed,
  Calendar,
  Wallet
} from "lucide-react"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const perks = [
  {
      icon: Icons.auth,
      title: "Sign Up",
      info: "Create your free account to get started with Astra.",
  },
  {
      icon: Icons.customize,
      title: "Customize",
      info: "Choose a template and customize it to fit your needs.",
  },
  {
      icon: Icons.launch,
      title: "Launch",
      info: "Publish your website and share it with the world.",
  },
];

export const features = [
  {
    icon: Home,
    title: "Room Management",
    info: "Smart room allocation system with automated roommate matching and room swapping requests.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Wrench,
    title: "Maintenance & Cleaning",
    info: "Streamlined complaint submission and tracking system with scheduled cleaning management.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: ShowerHead,
    title: "Laundry & Utilities",
    info: "Integrated laundry booking system with vendor management and utility tracking features.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: UtensilsCrossed,
    title: "Mess Management",
    info: "Daily food ratings, hygiene feedback system, and weekly menu planning interface.",
    gradient: "from-orange-500 to-yellow-500"
  },
  {
    icon: Calendar,
    title: "Events & Community",
    info: "Comprehensive event management with announcements and RSVP system for hostel activities.",
    gradient: "from-red-500 to-rose-500"
  },
  {
    icon: Wallet,
    title: "Billing & Payments",
    info: "Automated monthly invoicing with integrated payment gateway for hassle-free fee collection.",
    gradient: "from-indigo-500 to-violet-500"
  }
];

export const pricingCards = [
  {
      title: "Starter",
      description: "Perfect for trying out plura",
      price: "Free",
      duration: "",
      highlight: "Key features",
      buttonText: "Start for free",
      features: ["Limited projects", "1 Team member", "Basic features"],
      priceId: "",
  },
  {
      title: "Unlimited Saas",
      description: "The ultimate agency kit",
      price: "$199",
      duration: "month",
      highlight: "Key features",
      buttonText: "Upgrade to Pro",
      features: ["Unlimited projects", "5 Team members", "Advanced design tools", "Customizable domain"],
      priceId: "price_1OYxkqFj9oKEERu1KfJGWxgN",
  },
  {
      title: "Enterprise",
      description: "For serious agency owners",
      price: "$399",
      duration: "month",
      highlight: "Everything in Starter, plus",
      buttonText: "Upgrade to Enterprise",
      features: ["Unlimited projects", "Unlimited Team members", "Custom branding", "Priority support (24/7)"],
      priceId: "price_1OYxkqFj9oKEERu1NbKUxXxN",
  },
];

export const bentoCards = [
  {
      title: 'Start with Inspiration',
      info: 'Browse our vast library of pre-designed templates or upload your own images.',
      imgSrc: '/assets/bento-1.svg', // Lightbulb or Inspiration icon
      alt: 'Inspiration for website creation'
  },
  {
      title: 'AI Assists Your Vision',
      info: 'Our intelligent AI tailors suggestions and functionalities based on your goals.',
      imgSrc: '/assets/bento1.svg', // AI Assistant icon
      alt: 'AI website building assistant'
  },
  {
      title: 'Drag & Drop Customization',
      info: 'Effortlessly personalize your website with our intuitive drag-and-drop editor.',
      imgSrc: '/assets/bento1.svg', // Drag and Drop icon or hand editing a website
      alt: 'Website customization with drag and drop'
  },
  {
      title: 'Launch & Shine Online',
      info: 'Publish your website with a single click and take your brand to the world.',
      imgSrc: '/assets/bento1.svg', // Rocket launching or website going live
      alt: 'Website launch and publication'
  },
];

export const reviews = [
  {
      name: "Jack",
      username: "@jack",
      body: "I've never seen anything like this before. It's amazing. I love it.",
  },
  {
      name: "Jill",
      username: "@jill",
      body: "I don't know what to say. I'm speechless. This is amazing.",
  },
  {
      name: "John",
      username: "@john",
      body: "I'm at a loss for words. This is amazing. I love it.",
  },
  {
      name: "Jane",
      username: "@jane",
      body: "I'm at a loss for words. This is amazing. I love it.",
  },
  {
      name: "Jenny",
      username: "@jenny",
      body: "I'm at a loss for words. This is amazing. I love it.",
  },
  {
      name: "James",
      username: "@james",
      body: "I'm at a loss for words. This is amazing. I love it.",
  },
];