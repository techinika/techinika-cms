import { EventsPage } from "@/components/pages/OneCompany/EventsPage";
import React from "react";

async function page({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;

  return (
    <div>
      <EventsPage companySlug={company} />
    </div>
  );
}

export default page;
