import { useAuth } from "../context/AuthContext";
import { permissions } from "../constants/permissions";

// Usage inside any component:
//   const { can } = usePermission();
//   {can("invoices", "delete") && <DeleteButton />}
export const usePermission = () => {
  const { user } = useAuth();

  const role = user?.role?.toLowerCase();

  const can = (module, action) => {
    if (!role) return false;

    // Owner always has full access.
    if (role === "owner") return true;

    return !!permissions[role]?.[module]?.[action];
  };

  return { can, role };
};
