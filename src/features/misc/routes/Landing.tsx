import { useNavigate } from "react-router";

import { Button } from "components/Elements";
import { Head } from "components/Head";
import { useAuth } from "lib/auth";
import { APP_NAME } from "config";
import { mdiHome } from "@mdi/js";

export const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStart = () => {
    if (user) {
      navigate("/app");
    } else {
      navigate("/auth/login");
    }
  };

  return (
    <>
      <Head description="Welcome " />
      <div className="h-[100vh] flex items-center">
        <div className="max-w-7xl mx-auto text-center px-4 py-12">
          <h2 className="text-3xl font-bold tracking-tight  sm:text-4xl">
            {APP_NAME}
          </h2>
          <div className="mt-8 flex ">
            <div className="inline-flex rounded-md shadow">
              <Button onClick={handleStart} startIcon={mdiHome}>
                Get started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
