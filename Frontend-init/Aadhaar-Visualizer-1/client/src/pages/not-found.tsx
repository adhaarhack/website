import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-border/50">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 text-destructive">
            <AlertCircle className="h-8 w-8" />
            <h1 className="text-2xl font-bold font-display">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600 font-body leading-relaxed">
            The page you are looking for does not exist or has been moved. 
            Please check the URL or return to the dashboard.
          </p>

          <div className="mt-8 flex justify-end">
             <Link href="/">
              <Button className="bg-primary hover:bg-primary/90 text-white font-medium shadow-md hover:shadow-lg transition-all">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
