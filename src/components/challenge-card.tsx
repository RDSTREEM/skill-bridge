import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Trophy, ArrowRight } from "lucide-react";
import Link from "next/link"

interface ChallengeCardProps {
  challenge: {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    estimatedHours: number;
    tags: string[];
    organization?: string;
    enrolledCount?: number;
    completedCount?: number;
  };
  variant?: "default" | "enrolled" | "completed";
  showLoginNote?: boolean; // true for homepage, false for challenges section
}

export function ChallengeCard({ challenge, variant = "default", showLoginNote = false }: ChallengeCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-success text-success-foreground";
      case "Intermediate":
        return "bg-warning text-warning-foreground";
      case "Advanced":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "enrolled":
        return "ring-2 ring-primary bg-primary-light";
      case "completed":
        return "ring-2 ring-success bg-success-light";
      default:
        return "hover:bg-card-hover hover:shadow-md";
    }
  };

  return (
    <Card className={`transition-all duration-300 ${getVariantStyles()}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Badge className={getDifficultyColor(challenge.difficulty)}>
              {challenge.difficulty}
            </Badge>
            <h3 className="heading-sm line-clamp-2">{challenge.title}</h3>
            {challenge.organization && (
              <p className="body-sm text-muted-foreground">{challenge.organization}</p>
            )}
          </div>
          {variant === "completed" && (
            <Trophy className="h-5 w-5 text-success flex-shrink-0" />
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="body-sm text-muted-foreground line-clamp-3 mb-4">
          {challenge.shortDescription}
        </p>

        <div className="flex flex-wrap gap-1">
          {challenge.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {challenge.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{challenge.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex flex-col gap-2">
        {variant === "default" ? (
          showLoginNote ? (
            <>
              <Button asChild className="w-full" variant="outline">
                <Link href="/login" className="flex items-center justify-center space-x-2">
                  <span>Login and Apply</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-1">
                After logging in, go to the <b>Challenges</b> section and search for this challenge to apply.
              </p>
            </>
          ) : (
            <Button asChild className="w-full" variant="outline">
              <Link href={`/challenges/${challenge.slug}`} className="flex items-center justify-center space-x-2">
                <span>Apply</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )
        ) : (
          <Button asChild className="w-full" variant={variant === "enrolled" ? "default" : "outline"}>
            <Link href={`/challenges/${challenge.slug}`} className="flex items-center justify-center space-x-2">
              <span>
                {variant === "completed" ? "View Results" : 
                 variant === "enrolled" ? "Continue" : "Start Challenge"}
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}