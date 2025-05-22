import React from "react";
import { useParams, Link } from "react-router-dom";
import ContentPage from "@/docs-app/ui/components/content/ContentPage.tsx";
import apiExamplesMap from "@/docs-app/data/apiExamplesMap";
import type { ApiExamplesData } from "@/docs-app/data/types.ts";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/alert";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/shared/components/button";

interface DynamicDocPageProps {
  section:
    | "api"
    | "sdk"
    | "advanced"
    | "wordpress"
    | "webhooks"
    | "google-tag-manager";
}

const DynamicDocPage: React.FC<DynamicDocPageProps> = ({ section }) => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto my-12">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          No document slug provided. Please navigate to a valid documentation
          page.
          <div className="mt-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go to homepage
              </Link>
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // Construct the content path and current path
  const contentPath = `/${section}/${slug}.md`;
  const currentPath = `/${section}/${slug}`;

  // Look up API examples if they exist for this path
  const apiExamples: ApiExamplesData | undefined = apiExamplesMap[currentPath];

  return (
    <ContentPage
      contentPath={contentPath}
      currentPath={currentPath}
      apiExamples={apiExamples}
    />
  );
};

export default DynamicDocPage;
