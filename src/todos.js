import { replace, remove } from '@most/prelude'
import uuid from 'uuid4'

// type Id = Uuid
const newId = uuid

// data Todo = { id::Id, description::string, complete::boolean }

// emptyTodos :: [Todo]
export const emptyTodos = []

// newTodo :: Id -> string -> boolean -> Todo
export const newTodo = (id, description, complete) =>
  ({ id, description, complete })

export const findTodoIndex = (id, todos) => todos.findIndex(todo => todo.id === id)

// addTodo :: string -> [Todo] -> [Todo]
export const addTodo = description => todos =>
  description.trim().length === 0 ? todos
    : todos.concat(newTodo(newId(), description, false))

// removeTodo :: Id -> [Todo] -> [Todo]
export const removeTodo = id => todos =>
  remove(findTodoIndex(id, todos), todos)

// updateDescription :: Id -> description -> [Todo] -> [Todo]
export const updateDescription = (id, description) => todos => {
  const i = findTodoIndex(id, todos)
  return i < 0 ? todos
    : replace(newTodo(id, description, todos[i].complete), i, todos)
}

// updateTodo :: (Id, boolean) -> [Todo] -> [Todo]
export const updateComplete = ({ id, complete }) => todos => {
  const i = findTodoIndex(id, todos)
  return i < 0 ? todos
    : replace(newTodo(id, todos[i].description, complete), i, todos)
}

// updateAll :: boolean -> [Todo] -> [Todo]
export const updateAllComplete = complete => todos =>
  todos.map(({ id, description }) => newTodo(id, description, complete))

// removeComplete :: [Todo] -> [Todo]
export const removeComplete = todos => todos.filter(notComplete)

// isComplete :: Todo -> boolean
export const isComplete = ({ complete }) => complete

// isComplete :: Todo -> boolean
export const notComplete = todo => !isComplete(todo)
