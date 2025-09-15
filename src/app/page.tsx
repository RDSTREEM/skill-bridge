import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { MobileNav, DesktopNav } from "@/components/ui/navigation";
import { ChallengeCard } from "@/components/challenge-card";
import { 
  BookOpen, 
  Users, 
  Award, 
  TrendingUp, 
  ArrowRight,
  Target,
  Globe,
  Zap
} from "lucide-react";
import Link from "next/link";

// Mock data for demonstration
const featuredChallenges = [
  {
    id: "1",
    slug: "web-development-basics",
    title: "Web Development Fundamentals",
    shortDescription: "Learn HTML, CSS, and JavaScript basics by building a responsive personal portfolio website.",
    difficulty: "Beginner" as const,
    estimatedHours: 8,
    tags: ["HTML", "CSS", "JavaScript", "Portfolio"],
    organization: "Tech Academy Ethiopia",
    enrolledCount: 234,
  },
  {
    id: "2", 
    slug: "digital-marketing-campaign",
    title: "Digital Marketing Campaign Design",
    shortDescription: "Create a complete social media marketing strategy for a local Ethiopian business.",
    difficulty: "Intermediate" as const,
    estimatedHours: 12,
    tags: ["Marketing", "Social Media", "Analytics", "Strategy"],
    organization: "Marketing Institute",
    enrolledCount: 156,
  },
  {
    id: "3",
    slug: "mobile-app-ui-design",
    title: "Mobile App UI/UX Design",
    shortDescription: "Design a mobile application interface following modern UX principles and accessibility guidelines.",
    difficulty: "Intermediate" as const,
    estimatedHours: 15,
    tags: ["UI/UX", "Figma", "Mobile Design", "Accessibility"],
    organization: "Design Studio Addis",
    enrolledCount: 89,
  },
];

const stats = [
  { label: "Active Students", value: "2,500+", icon: Users },
  { label: "Skill Challenges", value: "150+", icon: Target },
  { label: "Certificates Issued", value: "4,200+", icon: Award },
  { label: "Success Rate", value: "94%", icon: TrendingUp },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <MobileNav />
      <DesktopNav />
      
      <main className="pb-16 md:pb-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-hero">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="text-center text-white">
              <Badge className="mb-6 bg-white/20 text-white border-white/30" variant="outline">
                <Globe className="h-4 w-4 mr-2" />
                Empowering Ethiopian Students
              </Badge>
              
              <h1 className="heading-xl mb-6 max-w-4xl mx-auto">
                Bridge the Gap Between
                <span className="block text-accent-yellow">Education & Industry</span>
              </h1>
              
              <p className="body-lg mb-8 max-w-2xl mx-auto opacity-90">
                Complete real-world skill challenges, get mentored by industry experts, 
                and earn verified certificates that showcase your capabilities.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/challenges">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Browse Challenges
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20" asChild>
                  <Link href="/login">
                    Get Started Free
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label} className="text-center">
                    <CardContent className="pt-6">
                      <div className="flex justify-center mb-3">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="heading-md text-foreground mb-1">{stat.value}</div>
                      <div className="body-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="heading-lg mb-4">How Skill Bridge Works</h2>
              <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
                A simple 4-step process to develop real-world skills and advance your career
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "1",
                  title: "Choose Challenge",
                  description: "Browse curated skill challenges aligned with industry needs",
                  icon: Target,
                },
                {
                  step: "2", 
                  title: "Complete Project",
                  description: "Work on real-world projects with clear deliverables and deadlines",
                  icon: Zap,
                },
                {
                  step: "3",
                  title: "Get Reviewed",
                  description: "Receive detailed feedback from industry mentors and experts",
                  icon: Users,
                },
                {
                  step: "4",
                  title: "Earn Certificate",
                  description: "Receive verified digital certificates to showcase your skills",
                  icon: Award,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.step} className="text-center">
                    <div className="relative mb-6">
                      <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto shadow-glow">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-accent-yellow flex items-center justify-center">
                        <span className="text-xs font-bold text-foreground">{item.step}</span>
                      </div>
                    </div>
                    <h3 className="heading-sm mb-2">{item.title}</h3>
                    <p className="body-sm text-muted-foreground">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Challenges */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="heading-lg mb-2">Featured Challenges</h2>
                <p className="body-lg text-muted-foreground">
                  Start your skill development journey today
                </p>
              </div>
              <Button variant="outline" asChild className="hidden sm:flex">
                <Link href="/challenges">
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredChallenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>

            <div className="text-center mt-8 sm:hidden">
              <Button variant="outline" asChild>
                <Link href="/challenges">
                  View All Challenges
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-primary">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto text-white">
              <h2 className="heading-xl mb-6">
                Ready to Build Your Future?
              </h2>
              <p className="body-lg mb-8 opacity-90">
                Join thousands of Ethiopian students who are developing industry-ready skills 
                and advancing their careers with Skill Bridge.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary">
                  <Link href="/login" className="flex items-center">
                    Create Free Account
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                  <Link href="/challenges" className="flex items-center">
                    Explore Challenges
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;