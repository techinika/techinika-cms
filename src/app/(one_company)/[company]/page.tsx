import IndexPage from "@/components/pages/OneCompany/IndexPage";
import React from "react";

async function page({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  return (
    <div>
      <IndexPage companySlug={company} />
    </div>
  );
}

export default page;
