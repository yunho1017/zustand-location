import { withLocation, LocationType, SetLocationType } from 'zustand-location';
import { create } from 'zustand';

interface LocationStore {
  loc: LocationType;
  setLoc: SetLocationType;
}

const locationStore = create<LocationStore>(
  withLocation((_, loc) => ({
    loc: loc.get(),
    setLoc: loc.set((prev, loc) => ({ ...prev, loc })),
  })),
);

const App = () => {
  const { loc, setLoc } = locationStore();
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

export default App;
