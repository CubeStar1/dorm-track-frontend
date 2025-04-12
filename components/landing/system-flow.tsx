import { motion } from "framer-motion"
import { Building2, Server, Users } from "lucide-react"
import Image from "next/image"

const flowSteps = [
  {
    title: "Student Portal",
    description: "Intuitive interface for room booking, maintenance requests, mess feedback, and event management",
    icon: Users,
    gradient: "from-blue-500 via-indigo-500 to-violet-500",
    shadowColor: "shadow-blue-500/25",
  },
  {
    title: "Backend Services",
    description: "Robust Next.js backend handling room allocation, complaints, events, and real-time updates",
    icon: Server,
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    shadowColor: "shadow-green-500/25",
  },
  {
    title: "Admin Dashboard",
    description: "Comprehensive management interface for hostel operations, student records, and facility maintenance",
    icon: Building2,
    gradient: "from-purple-500 via-violet-500 to-indigo-500",
    shadowColor: "shadow-purple-500/25",
  },
]

export function SystemFlow() {
  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          How It{" "}
          <span className="bg-gradient-to-r from-[#38bdf8] via-[#2dd4bf] to-[#0070F3] bg-clip-text text-transparent">
            Works
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Our comprehensive system streamlines hostel management through an integrated platform connecting students, wardens, and administrators
        </p>
      </motion.div>

      <div className="mt-16 grid gap-8 lg:grid-cols-3">
        {flowSteps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="relative group"
          >
            <div 
              className={`
                h-full rounded-2xl p-1 transition-all duration-300 
                bg-gradient-to-br ${step.gradient} opacity-75 hover:opacity-100
                hover:scale-[1.02] hover:-translate-y-1
              `}
            >
              <div className="h-full rounded-xl bg-background/90 p-6 backdrop-blur-xl">
                <div className={`
                  size-14 rounded-lg bg-gradient-to-br ${step.gradient}
                  flex items-center justify-center ${step.shadowColor}
                  shadow-lg transition-shadow duration-300 group-hover:shadow-xl
                `}>
                  <step.icon className="size-7 text-white" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-16"
      >
        <div className="relative rounded-2xl bg-gradient-to-b from-muted/50 to-muted p-2 ring-1 ring-foreground/10 backdrop-blur-3xl dark:from-muted/30 dark:to-background/80">
          <Image
            src="/dormtrack-system-flow.png"
            alt="DormTrack System Architecture"
            width={1200}
            height={600}
            quality={100}
            className="rounded-xl shadow-2xl ring-1 ring-foreground/10 transition-all duration-300"
          />
        </div>
      </motion.div>
    </section>
  )
} 