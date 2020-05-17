/*
 * contextCache
 *
 * Use this to maintain a scoped cache at any point in the component heirarchy.
 * <CacheScope> creates a scope from which any call to useCacheValue hooks can access.
 * That way we can control what components have access to the cache based on their
 * position in the component heirarchy.
 *
 */

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode
} from "react";

class Cache<T> {
  _cache: Map<any, CachePayload<T>>;
  _callback?: () => void;

  constructor() {
    this._cache = new Map();
  }

  onClear(callback?: () => void) {
    this._callback = callback;
  }

  clear() {
    this._cache.forEach(value => {
      value.notifySubscribers(undefined);
    });
    this._cache.clear();
    if (this._callback) {
      this._callback();
    }
  }

  getOrSet(key: any, supplier: () => CachePayload<T>) {
    const val = this._cache.get(key);
    if (val) {
      return val;
    } // else
    const newVal = supplier();
    this.set(key, newVal);
    return newVal;
  }

  set(key: any, value: any) {
    return this._cache.set(key, value);
  }
}

const context = createContext(new Cache<any>());
const { Provider } = context;

type CVProps<T> = {
  cacheKey: any;
  asyncResolver: () => Promise<T>; // The function you provide here must accept a function as an argument. When your function completes (asynchronously) it should invoke this passed in function with the value to cache as its argument.
};

class CachePayload<T> {
  promise: Promise<T>;
  subscriptions: Map<number, (value?: T) => void>; // Callbacks for those waiting on a value
  maxSubId: number;
  constructor(promise: Promise<T>) {
    this.subscriptions = new Map();
    this.maxSubId = 0;
    this.promise = promise.then((value: T) => {
      this.notifySubscribers(value);
      return value;
    });
  }

  subscribe(callback: (value?: T) => void) {
    const id = this.maxSubId++;
    this.subscriptions.set(id, callback);
    return id;
  }

  unsubscribe(id: number) {
    if (!this.subscriptions.delete(id)) {
      console.error(`Failed to unsubscribe id ${id}`);
    }
  }

  notifySubscribers(value?: T) {
    this.subscriptions.forEach(callback => {
      callback(value);
    });
  }
}

export const useCacheValue = <T extends unknown>(
  props: CVProps<T>
): [boolean, T | undefined] => {
  const { cacheKey, asyncResolver } = props;
  const [value, setState] = useState<T | undefined>();
  const cache: Cache<T> = useContext(context);

  useEffect(() => {
    if (!cache) {
      console.error(
        `ContextCache not found. Make sure a <CacheScope> is placed higher up in the component heirarchy`
      );
      return;
    }
    const payload = cache.getOrSet(cacheKey, () => {
      setState(undefined);
      return new CachePayload(asyncResolver());
    });
    const id = payload.subscribe((value?: T) => {
      setState(value);
    });
    return () => {
      payload.unsubscribe(id);
    };
  }, [cache, cacheKey, asyncResolver, setState]);

  const loading = !value;
  const retValue = value ? value : undefined;
  return [loading, retValue];
};

export const useClearCache = () => {
  const cache = useContext(context);
  return () => {
    cache.clear();
  };
};

export const CacheScope = (props: { children?: ReactNode }) => {
  // useState is used here to allow the Cache object to be updated in
  // the context. This allows all the useEffect hooks in useCacheValue
  // to rerun (since cache is a dependency)
  const [cache, setCache] = useState(new Cache());
  useEffect(() => {
    cache.onClear(() => {
      setCache(new Cache());
    });
    return () => {
      cache.onClear(undefined);
    };
  }, [cache, setCache]);
  return <Provider value={cache}>{props.children}</Provider>;
};

const ContextCache = {
  useCacheValue,
  useClearCache,
  CacheScope
};

export default ContextCache;
