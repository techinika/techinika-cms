import { NewOpportunityPage } from "@/components/pages/OneCompany/NewOpportunityPage";

async function page({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;

  return (
    <div>
      <NewOpportunityPage companySlug={company} />
    </div>
  );
}

export default page;
