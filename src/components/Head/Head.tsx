import { APP_NAME } from "config";
import { Helmet } from "react-helmet-async";

type HeadProps = {
  title?: string;
  description?: string;
};

export const Head = ({ title = "", description = "" }: HeadProps = {}) => {
  return (
    <Helmet
      title={title ? `${title} | ${APP_NAME}` : undefined}
      defaultTitle={APP_NAME}
    >
      <meta name="description" content={description} />
    </Helmet>
  );
};
