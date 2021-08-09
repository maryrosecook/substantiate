# Substantiate

A library to **help you prototype React apps faster**.

It is a standard React reducer with four extra properties:

1. Takes a `query` function. This lets you defined a centralized group of queries on your data, rather than spreading them all over your components.
2. Automatically saves your reducer state to `localStorage` and reloads it on refresh. This means that the state of your app will be restored after every code change, rather than you needing to recreate it by clicking/typing.
3. Exposes a context that includes your `state`, your `dispatch` function, and your `query` function. This means you can materialize these items in any component without having to pass them down through a component hierarchy.
4. Exposes `state`, `dispatch` and `query` at `window.substantiate` so you can view `state` and edit it from the browser console.

## Example

### Setup

Below, we create the reducer with a `dispatch` function, a `query` function and initial `state`. And we set up the context provider so these items will be available later.

```typescript
function App() {
  const {state, dispatch, query, AppContext} = useAppState<AppState, AppAction, QueryFn>(
    // Reducer function:
    (state: AppState, action: AppAction): AppState {
      switch (action.type) {
        case addPersonWithPets':
          // Add person with pets, then:
          return newState;
      }
    },
    // Query function:
    <T extends Query>(state: AppState, query: T): {
      switch (query.type) {
        case getPersonPets': {
          // Find person's pets using query.personId, then:
          return pets as QueryReturn<T>;
        }
      }
    },
    // Initial state:
    {
      people: [{id: 0, name: 'Mary'}],
      pets: [{id: 0, name: 'Donnie', personId: 0}],
    },
    // Key to store state at in localStorage:
    'myAppLocalStorageKey',
  );

  return (
    <AppContext.Provider value={{state, dispatch, query}}>
      <Person person={state.people[0]} />
    </AppContext.Provider>
  );
}
```

### Usage

Here we materialize `query` and use it. Notice how we didn't need to pass it down through props.

```ts
function Person({person}: {person: Person}) {
  const {state, query} = useAppContext<AppState, AppAction, QueryFn>();

  const pets = query(state, {type: 'getPersonPets', personId: person.id});

  return (
    <div>
      {person.name}

      {Pets: {pets.map((pet) => pet.name).join(", ")}}
    </div>
  );
}
```

### Full code

See a [full code example](./example.ts).

## Get the code

- [npm](https://www.npmjs.com/package/substantiate) `$ npm install --save substantiate`
- [Github](https://github.com/maryrosecook/substantiate)

## Motivation

When prototyping, speed of development is of the essence. At the same time, it's easy for speedy shortcuts to slow you down later. Substantiate is an attempt to optimize that trade-off.

It maintains speed in the long term by centralizing your state, mutators and queries. You can think of this group as a database. Keeping the logic for mutating and querying together helps keep your domain model coherent because any code changes happen in one place.

It speeds things up in the short term by letting you materialize your `dispatch` and `query` functions anywhere in your code. This way, you don't have to mess around passing them down. This makes component hierarchies less rigid which speeds up additions and code changes.

It adds a couple of extra conveniences for speed. First, the `state` is persisted in `localStorage` and loaded on refresh. No more endless clicking to get the UI back into the state you need after a code change. Second, it exposes `state`, `query` and `dispatch` at `window.substantiate`. It's often much faster to figure out the system state by poking around in state than by running a debugger or printing things out. And if you need to make any quick edits to the system state, you can use `dispatch`, or even hot edit `state`.

## Author

Mary Rose Cook / mary@maryrosecook.com
