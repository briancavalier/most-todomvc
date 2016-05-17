export const initStore = (storage, key, defaultValue) =>
  [getItemOrDefault(storage, key, defaultValue), store(storage, key)]

const store = (storage, key) => value => {
  storage.setItem(key, JSON.stringify(value))
  return store(storage, key)
}

const getItemOrDefault = (storage, key, defaultValue) => {
  const data = storage.getItem(key)
  return data == null ? defaultValue : JSON.parse(data)
}
