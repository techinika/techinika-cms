import { OneOpportunityPage } from "@/components/pages/OneCompany/OneOpportunityPage";

async function page({
  params,
}: {
  params: Promise<{ company: string; opportunity: string }>;
}) {
  const { company, opportunity } = await params;

  return (
    <div>
      <OneOpportunityPage companySlug={company} opportunityId={opportunity} />
    </div>
  );
}

export default page;
