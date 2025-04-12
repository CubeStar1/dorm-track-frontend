import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

const features = [
  {
    title: "Room Allocation Management",
    description: "Efficiently manage room allocations, view occupancy status, and handle room change requests through an intuitive interface.",
    image: "/dormtrack-admin-allocation.png",
    alt: "Room allocation management dashboard",
  },
  {
    title: "Maintenance & Complaints",
    description: "Track and resolve maintenance requests and student complaints with our comprehensive ticketing system.",
    image: "/dormtrack-admin-complaints.png",
    alt: "Complaints management interface",
  },
  {
    title: "Mess Management",
    description: "Monitor mess feedback, manage menu planning, and track food quality ratings to ensure student satisfaction.",
    image: "/dormtrack-admin-mess.png",
    alt: "Mess management dashboard",
  },
  {
    title: "Room Overview",
    description: "Get a comprehensive view of all rooms, their occupancy status, and maintenance conditions in an easy-to-navigate interface.",
    image: "/dormtrack-admin-rooms.png",
    alt: "Room management dashboard",
  },
  {
    title: "Institution Management",
    description: "Manage multiple institutions, their hostel blocks, and associated wardens all from a centralized dashboard.",
    image: "/dormtrack-admin-institutions.png",
    alt: "Institution management interface",
  },
  {
    title: "Maintenance Tracking",
    description: "Keep track of all maintenance requests, assign staff, and monitor completion status for efficient facility management.",
    image: "/dormtrack-admin-maintenance.png",
    alt: "Maintenance tracking dashboard",
  },
  {
    title: "Student Dashboard",
    description: "View and manage student profiles, room assignments, and activity logs through a user-friendly interface.",
    image: "/dormtrack-student-dashboard.png",
    alt: "Student management dashboard",
  },
  {
    title: "Admin Overview",
    description: "Get a bird's eye view of all hostel operations, key metrics, and important notifications in one place.",
    image: "/dormtrack-admin-dashboard.png",
    alt: "Admin overview dashboard",
  }
]

export function AdminDashboard() {
  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Powerful{" "}
          <span className="bg-gradient-to-r from-[#38bdf8] via-[#2dd4bf] to-[#0070F3] bg-clip-text text-transparent">
            Admin Dashboard
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Take control of your hostel operations with our comprehensive management dashboard
        </p>
      </motion.div>

      <div className="mt-16 grid grid-cols-1 gap-16 sm:gap-24">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`flex flex-col gap-8 lg:items-center ${
              index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
            }`}
          >
            {/* Text Content */}
            <div className="flex-1 space-y-4">
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {feature.title}
                </h3>
                <p className="mt-4 text-lg leading-8 text-muted-foreground">
                  {feature.description}
                </p>
                <div className="mt-6">
                  <button className="group inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Learn more
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Image */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative rounded-2xl bg-gradient-to-b from-muted/50 to-muted p-2 ring-1 ring-foreground/10 backdrop-blur-3xl dark:from-muted/30 dark:to-background/80"
              >
                <Image
                  src={feature.image}
                  alt={feature.alt}
                  width={600}
                  height={400}
                  quality={100}
                  className="rounded-xl shadow-2xl ring-1 ring-foreground/10 transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 opacity-0 transition-opacity duration-300 hover:opacity-100" />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
} 