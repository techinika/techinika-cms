import { UsersPage } from "@/components/pages/OneCompany/UsersPage";

async function page({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;

  return (
    <div>
      <UsersPage companySlug={company} />
    </div>
  );
}

export default page;
