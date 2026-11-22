import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import AdminInbox from "@/components/AdminInbox";

export default function AdminPage() {
  if (!isAdminAuthenticated()) redirect("/admin/login");
  return (
    <main>
      <div className="admin-bar">
        <div className="admin-wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <strong>Pixel State Admin</strong>
          <span>
            <a href="/" style={{ color: "#fff", marginRight: 16 }}>View public site</a>
            <a href="/admin/login" style={{ color: "#fff" }}>Sign out is in the inbox below</a>
          </span>
        </div>
      </div>
      <div className="admin-wrap" style={{ paddingTop: 24, paddingBottom: 48 }}>
        <h1>Enquiry inbox</h1>
        <p className="muted">New enquiries from the public form land here automatically. The inbox starts empty.</p>
        <AdminInbox />
      </div>
    </main>
  );
}
