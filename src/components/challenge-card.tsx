import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";

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
}

export function ChallengeCard({
  challenge,
  variant = "default",
}: ChallengeCardProps) {
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
              <p className="body-sm text-muted-foreground">
                {challenge.organization}
              </p>
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

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{challenge.estimatedHours}h</span>
          </div>
          {challenge.enrolledCount && (
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{challenge.enrolledCount} enrolled</span>
            </div>
          )}
        </div>

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

      <CardFooter className="pt-0">
        <Button
          asChild
          className="w-full"
          variant={variant === "enrolled" ? "default" : "outline"}
        >
          <Link
            href={`/challenges/${challenge.slug}`}
            className="flex items-center justify-center space-x-2"
          >
            <span>
              {variant === "completed"
                ? "View Results"
                : variant === "enrolled"
                  ? "Continue"
                  : "Start Challenge"}
            </span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
