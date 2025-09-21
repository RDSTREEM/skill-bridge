import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export function ProfileDropdown() {
  const { user } = useAuth();
  // Placeholder logout function, replace with actual implementation if available
  const logout = () => {
    // TODO: Implement logout logic
    alert("Logout not implemented");
  };
  const router = useRouter();
  if (!user) return null;
  return (
    <div className="relative group">
      <button className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 font-medium">
        {user.email}
      </button>
      <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
        <button
          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          onClick={() => router.push("/dashboard")}
        >
          Dashboard
        </button>
        <button
          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
