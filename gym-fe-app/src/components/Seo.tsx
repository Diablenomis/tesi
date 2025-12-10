import { Helmet, HelmetProvider } from "react-helmet-async";
interface SeoProps{
    pageTitle: string
}
export const Seo: React.FC<SeoProps> = ({ pageTitle }) => (
  <HelmetProvider>
    <Helmet>
      <title>
        {pageTitle &&
          `${pageTitle} || FIT NEXUS}`}
      </title>
    </Helmet>
  </HelmetProvider>
);
