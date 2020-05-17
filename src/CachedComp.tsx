import React from "react";
import createFetcher from "./mockServer";
import { useCacheValue } from "./ContextCache";
import "./styles.css";

const CachedComp = () => {
  const fetcher = createFetcher(1000);
  const [loading, value] = useCacheValue({
    cacheKey: "test",
    asyncResolver: fetcher
  });

  if (loading) {
    return (
      <div className="InnerCached">
        <h3>Loading...</h3>
      </div>
    );
  }
  return (
    <div className="InnerCached">
      <h3>{value}</h3>
    </div>
  );
};

export default CachedComp;
