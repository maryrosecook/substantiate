import {useAppContext, getAppContext, useAppState} from 'src/index';
import {v4 as uuid} from 'uuid';

function App() {
  const {state, dispatch, query} = useAppState<AppState, AppAction, QueryFn>(
    _dispatch,
    _query,
    getInitialState(),
  );

  const AppContext = getAppContext<AppState, AppAction, QueryFn>();

  return (
    <AppContext.Provider value={{state, dispatch, query}}>
      <Person person={state.people[0]} />
    </AppContext.Provider>
  );
}

function _dispatch(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'addPersonWithPets':
      const newPerson = {id: uuid(), name: action.name};
      const newPets = action.petNames.map((name) => ({
        id: uuid(),
        name,
        personId: newPerson.id,
      }));

      return {
        ...state,
        people: [...state.people, newPerson],
        pets: [...state.pets, ...newPets],
      };
  }
}

function _query<T extends Query>(state: AppState, query: T): QueryReturn<T> {
  switch (query.type) {
    case 'getPersonPets':
      return state.pets.filter(
        (pet: Pet) => pet.personId === query.personId,
      ) as QueryReturn<T>;
  }
}

function getInitialState() {
  const person = {id: uuid(), name: 'Mary'};
  return {
    people: [person],
    pets: [{id: uuid(), name: 'Donnie', personId: person.id}],
  };
}

function Person({person}: {person: Person}) {
  const {state, query} = useAppContext<AppState, AppAction, QueryFn>();

  const pets = query(state, {type: 'getPersonPets', personId: person.id});

  return (
    <div>
      {person.name}
      Pets: {pets.map((pet) => pet.name).join(', ')}
    </div>
  );
}

type AppState = {people: Array<Person>; pets: Array<Pet>};

type AppAction = {
  type: 'addPersonWithPets';
  name: string;
  petNames: Array<string>;
};

export type QueryFn = <T extends Query>(
  state: AppState,
  query: T,
) => QueryReturn<T>;

export type QueryReturn<T> = T extends GetPersonPets ? Array<Pet> : never;

type Query = GetPersonPets;

type GetPersonPets = {
  type: 'getPersonPets';
  personId: string;
};

type Person = {
  id: string;
  name: string;
};

type Pet = {
  id: string;
  name: string;
  personId: string;
};
