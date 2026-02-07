'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Zap,
  Calendar,
  Bell,
  Palette,
} from 'lucide-react';

/* ================= ANIMATION VARIANTS ================= */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const LandingPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/90">


      {/* ================= HERO ================= */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.8 }}
        className="py-20 text-center px-4"
      >
        <div className="inline-block px-4 py-1 mb-4 text-sm font-medium text-primary-700 dark:text-primary-300 bg-primary-100/80 dark:bg-primary-900/20 rounded-full">
          AI-Powered Productivity Suite
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
          Transform Your{' '}
          <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            Productivity
          </span>{' '}
          with Smart Todo Management
        </h1>

        <p className="text-xl text-foreground/80 max-w-3xl mx-auto mb-10">
          Intelligent task management, beautiful themes, calendar integration,
          and smart notifications designed for modern workflows.
        </p>

        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp}>
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Link href="/login">
              <Button variant="outline" size="lg" className="border-border text-foreground hover:bg-accent">
                Sign In
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Trust */}
        <motion.div
          className="mt-12 flex flex-wrap justify-center gap-8 text-foreground/70"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <span>4.9/5 Rating</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-5 w-5 text-primary-500" />
            <span>10K+ Users</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="h-5 w-5 text-green-500" />
            <span>Lightning Fast</span>
          </div>
        </motion.div>
      </motion.section>

      {/* ================= FEATURES ================= */}
      <section className="py-20 bg-background/30">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-16 px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Powerful Features for Maximum Productivity
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Everything you need to organize your tasks, boost productivity, and achieve your goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
            <FeatureCard
              icon={<Palette className="h-8 w-8 text-primary-500" />}
              title="Multiple Themes"
              description="Choose from various color themes including light, dark, and accent color options to match your style."
            />
            <FeatureCard
              icon={<Calendar className="h-8 w-8 text-primary-500" />}
              title="Calendar Integration"
              description="View your tasks on a calendar, set due dates, and get scheduled reminders for important deadlines."
            />
            <FeatureCard
              icon={<Bell className="h-8 w-8 text-primary-500" />}
              title="Smart Notifications"
              description="Receive intelligent notifications for upcoming tasks, deadlines, and important updates."
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-primary-500" />}
              title="AI-Powered Insights"
              description="Get personalized productivity insights and recommendations based on your task completion patterns."
            />
            <FeatureCard
              icon={<CheckCircle className="h-8 w-8 text-primary-500" />}
              title="Advanced Task Management"
              description="Organize tasks with priorities, categories, tags, and custom workflows tailored to your needs."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-primary-500" />}
              title="Team Collaboration"
              description="Share tasks, assign responsibilities, and collaborate with your team in real-time."
            />
          </div>
        </motion.div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-20 bg-background/20">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">
          Trusted by Productive Professionals
        </h2>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 px-4"
        >
          <TestimonialCard quote="This app transformed how I manage my daily tasks. The calendar integration is a game-changer!" author="Sarah K." role="Product Manager" />
          <TestimonialCard quote="The multiple themes and notification system make this the perfect productivity app for any workflow." author="Michael T." role="Software Engineer" />
          <TestimonialCard quote="Finally, a todo app that understands how people actually work. Highly recommend!" author="Emma R." role="Marketing Director" />
        </motion.div>
      </section>

      {/* ================= CTA ================= */}
      <motion.section
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-20 bg-gradient-to-r from-primary-500 to-primary-600 text-white"
      >
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Boost Your Productivity?
          </h2>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            Join thousands of professionals who have transformed their workflow with our intelligent todo platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ================= FOOTER ================= */}
      <footer className="py-12 px-4 border-t border-border bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                  TodoPro
                </div>
              </div>
              <p className="text-foreground/60 text-sm">
                The ultimate productivity platform for individuals and teams.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><Link href="#" className="hover:text-primary-600">Features</Link></li>
                <li><Link href="#" className="hover:text-primary-600">Pricing</Link></li>
                <li><Link href="#" className="hover:text-primary-600">Security</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><Link href="#" className="hover:text-primary-600">About</Link></li>
                <li><Link href="#" className="hover:text-primary-600">Blog</Link></li>
                <li><Link href="#" className="hover:text-primary-600">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><Link href="#" className="hover:text-primary-600">Help Center</Link></li>
                <li><Link href="#" className="hover:text-primary-600">Contact</Link></li>
                <li><Link href="#" className="hover:text-primary-600">Community</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-foreground/60">
            <p>© 2026 TodoPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* ================= COMPONENTS ================= */

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <motion.div
    variants={fadeUp}
    className="p-6 border border-border rounded-xl hover:shadow-lg transition-all duration-300 group hover:-translate-y-1 bg-card"
  >
    <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-foreground/70">{description}</p>
  </motion.div>
);

const TestimonialCard = ({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role: string;
}) => (
  <motion.div variants={fadeUp} className="p-6 border border-border rounded-xl bg-card">
    <div className="flex mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
      ))}
    </div>
    <p className="italic mb-4 text-foreground/80">"{quote}"</p>
    <p className="font-medium text-foreground">{author}</p>
    <p className="text-sm text-foreground/60">{role}</p>
  </motion.div>
);

const TrustItem = ({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) => (
  <motion.div variants={fadeUp} className="flex items-center gap-2">
    {icon}
    <span>{text}</span>
  </motion.div>
);

export default LandingPage;
