import React from "react";
import { useClearCache } from "./ContextCache";

const ClearCacheButton = () => {
  const clearCache = useClearCache();
  return <button onClick={clearCache}>Clear Cache</button>;
};

export default ClearCacheButton;
