import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
export const withRouter = (WrappedComponent) => (props) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = useParams();
  const location = useLocation();

  return (
    <WrappedComponent
      {...props}
      navigate={navigate}
      searchParams={searchParams}
      params={params}
      location={location}
    />
  );
};
