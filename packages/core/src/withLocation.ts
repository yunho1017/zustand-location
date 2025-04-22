import type { StateCreator } from 'zustand';

export type LocationType = {
  pathname?: string;
  searchParams?: URLSearchParams;
  hash?: string;
};

export type LocationOptionsType = {
  replace?: boolean;
};

const getLocation = (): LocationType => {
  if (typeof window === 'undefined' || !window.location) {
    return {};
  }
  return {
    pathname: window.location.pathname,
    searchParams: new URLSearchParams(window.location.search),
    hash: window.location.hash,
  };
};

const applyLocation = (
  location: LocationType,
  options?: { replace?: boolean },
): void => {
  const url = new URL(window.location.href);
  if ('pathname' in location) {
    url.pathname = location.pathname;
  }
  if ('searchParams' in location) {
    url.search = location.searchParams.toString();
  }
  if ('hash' in location) {
    url.hash = location.hash;
  }
  if (options?.replace) {
    window.history.replaceState(window.history.state, '', url);
  } else {
    window.history.pushState(null, '', url);
  }
};

const subscribe = (callback: () => void) => {
  window.addEventListener('popstate', callback);
  return () => window.removeEventListener('popstate', callback);
};

type Options<T> = {
  replace?: boolean;
  getLocation?: () => T;
  applyLocation?: (location: T, options?: { replace?: boolean }) => void;
  subscribe?: (callback: () => void) => () => void;
};

export type GetLocationType = typeof getLocation;
export type SetLocationType = (loc: LocationType | ((prevLocation: LocationType) => LocationType), options?: LocationOptionsType) => void;
export function withLocation<T>(
  fn: (
    params:{set:  Parameters<StateCreator<T>>[0], get: Parameters<StateCreator<T>>[1], api: Parameters<StateCreator<T>>[2]},
    location: {get: GetLocationType, set: (update: (prev: T, location: LocationType) => T) => SetLocationType}
  ) => T,
  options?: Options<LocationType>
): StateCreator<T> {
  return (set, get, api) => {
    const getL = options?.getLocation || getLocation;
    const appL = options?.applyLocation || applyLocation;
    const sub = options?.subscribe || subscribe;

    const setLoc:(update: (prev: T, location: LocationType) => T) => SetLocationType = (update) => {
      const unsubscribe = sub(() => {
        const newLocation = getL();
        set(prev => update(prev, newLocation));
      });

    
      api.subscribe(() => {
        return () => {
          unsubscribe();
        };
      });

      return (loc, options)  => {
        const newLocation = typeof loc === 'function' ? loc(getL()) : loc;
        appL(newLocation, options);
      
        set(prev => update(prev, newLocation))
      }  
    }    




    return fn({set, get, api}, {get: getL, set: setLoc});
  };
}