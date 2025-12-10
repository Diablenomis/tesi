import { Helmet, HelmetProvider } from "react-helmet-async";
interface seoI {
    pageTitle:string
}
const Seo : React.FC = ( pageTitle ) => (
  <HelmetProvider>
    <Helmet>
      <title>
        {pageTitle &&
          `${pageTitle} || FIT NEXUS}`}
      </title>
    </Helmet>
  </HelmetProvider>
);

export default Seo;
