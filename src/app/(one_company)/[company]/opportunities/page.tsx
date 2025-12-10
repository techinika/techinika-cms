import { OpportunitiesPage } from "@/components/pages/OneCompany/OpportunityPage";

async function page({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;

  return (
    <div>
      <OpportunitiesPage companySlug={company} />
    </div>
  );
}

export default page;
