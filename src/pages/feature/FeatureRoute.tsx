import { lazy } from "react";

const Feature = lazy(() => import("./Feature"));

const FeatureRoute: any = {
    path: "feature",
    element: <Feature />
}

export default FeatureRoute