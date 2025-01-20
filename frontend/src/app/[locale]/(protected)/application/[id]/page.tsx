"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ApplicationType } from "@/types/applicationType";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import Navbar from "@/components/organisms/Navbar";
import { Skeleton } from "@/components/ui/skeleton";

export default function ApplicationPage() {
  const { id } = useParams();
  const [application, setApplication] = useState<ApplicationType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axiosInstance
        .get(`/application/${id}`)
        .then((response) => {
          setApplication(response.data.message);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching application:", error);
          setLoading(false);
        });
    }
  }, [id]);

  if (!application) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="grow min-h-screen p-4 flex flex-col">
      <Navbar />
      <div className="flex justify-center items-center flex-grow">
        <Card className="w-full max-w-lg p-4 shadow-lg rounded-lg bg-white">
          {loading ? (
            <Skeleton className="h-6 w-3/4 mb-2" />
          ) : (
            <CardHeader>
              <CardTitle className="text-lg md:text-2xl font-semibold text-center">
                {application?.Title}
              </CardTitle>
            </CardHeader>
          )}
          <CardContent>
            {loading ? (
              <Skeleton className="h-4 w-full mb-2" />
            ) : (
              <div className="flex justify-center">
                <Badge variant="outline">
                  Status: {application?.Status.Status}
                </Badge>
              </div>
            )}
            <div className="mt-4 space-y-2 text-sm md:text-base">
              {loading ? (
                <Skeleton className="h-4 w-1/2" />
              ) : (
                <p>
                  <span className="font-semibold">Company:</span>{" "}
                  {application?.Company}
                </p>
              )}
              {loading ? (
                <Skeleton className="h-4 w-3/4" />
              ) : (
                application?.Location && (
                  <p>
                    <span className="font-semibold">Location:</span>{" "}
                    {application.Location}
                  </p>
                )
              )}
              {loading ? (
                <Skeleton className="h-4 w-1/3" />
              ) : (
                application?.Salary && (
                  <p>
                    <span className="font-semibold">Salary:</span> $
                    {application.Salary.toLocaleString()}
                  </p>
                )
              )}
              {loading ? (
                <Skeleton className="h-12 w-full" />
              ) : (
                application?.Description && (
                  <p className="text-gray-600 whitespace-pre-line">
                    {application.Description}
                  </p>
                )
              )}
            </div>
            {application?.Url && !loading && (
              <div className="mt-6 flex justify-center">
                <Link href={application.Url} passHref>
                  <Button className="w-full md:w-auto" asChild>
                    <a target="_blank" rel="noopener noreferrer">
                      View Job Posting
                    </a>
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
