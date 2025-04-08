
import { Button } from "../shared/components/button";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, FileQuestion, BookOpen } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md px-4">
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-semibold">Documentation Page Not Found</h2>
        <p className="text-muted-foreground">
          Sorry, we couldn't find the documentation page you're looking for. The page might have been moved or is still being developed.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button asChild size="lg">
            <Link to="/" className="gap-2">
              <Home size={18} />
              Return to overview
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg">
            <Link to="/sdk/getting-started" className="gap-2">
              <FileQuestion size={18} />
              SDK documentation
            </Link>
          </Button>
        </div>
        
        <div className="pt-8 text-sm text-muted-foreground">
          <p>
            Looking for something specific? Check our{" "}
            <Link to="/api/events" className="text-primary hover:underline">
              API reference
            </Link>{" "}
            or contact Showpass support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
