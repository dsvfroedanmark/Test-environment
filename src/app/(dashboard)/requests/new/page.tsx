import { AppHeader } from "@/components/layout/app-header";
import { RequestForm } from "@/components/requests/request-form";

export default function NewRequestPage() {
  return (
    <div>
      <AppHeader
        title="New Request"
        description="Describe your goal. The system will propose a plan before doing any work."
      />
      <div className="p-6 max-w-3xl mx-auto">
        <RequestForm />
      </div>
    </div>
  );
}
