import { useAccess } from "../hooks/useAccess";

export const withAuthorization = (WrappedComponent) => (props, state) => {
  const [access] = useAccess();

  return <WrappedComponent {...props} access={[access]} isLoading={false} />;
};
