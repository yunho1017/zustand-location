# zustand-location

[![npm](https://img.shields.io/npm/v/zustand-location)](https://www.npmjs.com/package/zustand-location)
[![size](https://img.shields.io/bundlephobia/minzip/zustand-location)](https://bundlephobia.com/result?p=zustand-location)

When you create a zustand store, you receive additional params that can handle window.location.

## Install

This package has peer dependencies, which you need to install by yourself.

```bash
// npm
npm install zustand-locaiton zustand

// yarn
yarn add zustand-locaiton zustand
```

## Usage

```ts
// store.ts
import { create } from "zustand";
import { withLocation } from "zustand-location";

const useStore = create(
  withLocation(({ set }, loc) => ({
    ...Store,
    location: loc.get(),
    setLocation: loc.set()
  }))
);
```

```ts
// component.tsx
const Counter = () => {
  const {loc, setLoc} = useStore(state => ({ loc: state.location, setLoc: state.setLocation }));
  return (
    <ul>
      <li>
        <button
          type="button"
          style={{
            cursor: 'pointer',
            border: 'none',
            background: 'none',
            fontWeight: loc.pathname === '/' ? 'bold' : 'normal',
          }}
          onClick={() => setLoc((prev) => ({ ...prev, pathname: '/' }))}
        >
          Home
        </button>
      </li>
      <li>
        <button
          type="button"
          style={{
            cursor: 'pointer',
            border: 'none',
            background: 'none',
            fontWeight:
              loc.pathname === '/foo' && !loc.searchParams?.get('bar')
                ? 'bold'
                : 'normal',
          }}
          onClick={() =>
            setLoc((prev) => ({
              ...prev,
              pathname: '/foo',
              searchParams: new URLSearchParams(),
            }))
          }
        >
          Foo
        </button>
      </li>
      <li>
        <button
          type="button"
          style={{
            cursor: 'pointer',
            border: 'none',
            background: 'none',
            fontWeight:
              loc.pathname === '/foo' && loc.searchParams?.get('bar') === '1'
                ? 'bold'
                : 'normal',
          }}
          onClick={() =>
            setLoc((prev) => ({
              ...prev,
              pathname: '/foo',
              searchParams: new URLSearchParams([['bar', '1']]),
            }))
          }
        >
          Foo?bar=1
        </button>
      </li>
    </ul>
  );
};
```