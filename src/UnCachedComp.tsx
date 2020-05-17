import React, { useState, useEffect } from "react";
import createFetcher from "./mockServer";
import "./styles.css";

/**
 * A Simple loading hook that just provides a loading
 * status until the final value is available
 */
const useLoading = <T extends unknown>(
  resolver: () => Promise<T>
): [boolean, T | undefined] => {
  const [value, setState] = useState<undefined | T>();
  useEffect(() => {
    var mounted = true;
    if (!value) {
      resolver().then(v => {
        if (mounted) {
          setState(v);
        }
      });
      return () => {
        mounted = false;
      };
    }
  });
  const loading = !value;
  return [loading, value];
};

const UnCachedComp = () => {
  const fetcher = createFetcher(1000);
  const [loading, value] = useLoading(fetcher);

  if (loading) {
    return (
      <div className="InnerNoCache">
        <h3>Loading...</h3>
      </div>
    );
  }
  return (
    <div className="InnerNoCache">
      <h3>{value}</h3>
    </div>
  );
};

export default UnCachedComp;
