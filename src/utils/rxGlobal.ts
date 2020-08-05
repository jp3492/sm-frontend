import { useState, useEffect } from "react";

const stores: any = {};

class Store {
  value: any = "";
  initialValue: any;
  setters: Array<any> = [];
  setInitialValue = (value: any) => {
    this.initialValue = value;
    this.setValue(value);
  };
  setValue = (value: any) => {
    this.value = value;
    this.setters.forEach((setter: any) => setter(this.value));
  };
  addSetter = (setter: any) => {
    this.setters = [...this.setters, setter];
  };
  unsubscribe = (setter: any) => {
    this.setters = this.setters.filter((s) => s !== setter);
    return this.setters.length;
  };
}

const initializeState = (id: string, value: any) => {
  stores[id] = new Store();
  stores[id].setInitialValue(value);
};

export const setGlobalState = (id: string, value: any) => {
  if (!stores[id]) {
    initializeState(id, value);
  } else {
    stores[id].setValue(value);
  }
};
export const sgs = setGlobalState;

export const getGlobalState = (id: string) => {
  try {
    return stores[id].value;
  } catch (error) {
    console.error(`No gloabl value for id: ${id}`);
  }
};
export const ggs = getGlobalState;

export const updateGlobalState = (id: string, cb: Function) => {
  const store = stores[id];
  if (!store) {
    console.error(`No store initialized for ${id}`);
  } else {
    const updatedValue = cb(store.value);
    store.setValue(updatedValue);
  }
};
export const ugs = updateGlobalState;

export const subGlobalState = (id: string, cb: Function) => {
  stores[id].addSetter(cb);
};
export const subgs = subGlobalState;

export const unsubGlobalState = (id: string, cb: Function) => {
  stores[id].unsubscribe(cb);
};
export const unsgs = unsubGlobalState;

export const resetGlobalState = (id: string) => {
  const store = stores[id];
  store.setValue(store.initialValue);
};
export const rgs = resetGlobalState;

export const resetGlobalStates = (ids: string[]) => {
  ids.forEach((id) => {
    const store = stores[id];
    store.setValue(store.initialValue);
  });
};
export const rgss = resetGlobalStates;

export const useGlobalState = (
  id: string,
  initialValue: any = ""
): [any, Function] => {
  const [_, set] = useState("");

  if (!stores.hasOwnProperty(id)) {
    initializeState(id, initialValue);
  }

  if (!stores[id].setters.includes(set)) {
    stores[id].addSetter(set);
  }

  const { value, setValue, unsubscribe } = stores[id];

  useEffect(
    () => () => {
      const setters = unsubscribe(set);
      if (setters.length === 0) {
        delete stores[id];
      }
    },
    []
  );

  return [value, setValue];
};
export const usegs = useGlobalState;