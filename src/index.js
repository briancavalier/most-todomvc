import { merge, map, tap, filter, scan } from 'most'
import { submit, change, click, dblclick, keyup, focusout, hashchange } from '@most/dom-event'

import snabbdom from 'snabbdom'
import props from 'snabbdom/modules/props'
import attrs from 'snabbdom/modules/attributes'
import clss from 'snabbdom/modules/class'

import { render } from './view'
import {
	addTodoAction, removeTodoAction, updateTodoAction, updateAllAction,
	clearCompleteAction, updateViewAction } from './action'

const applyAction = (state, action) => action(state)

const preventDefault = s => tap(doPreventDefault, s)
const doPreventDefault = e => e.preventDefault()

const isKey = code => s => filter(e => e.keyCode === code, s)
const match = (query, s) => filter(e => e.target.matches(query), s)

const ENTER_KEY = 13
const ESC_KEY = 27

const listActions = el => {
  const clicks = click(el)
  const changes = change(el)

  const add = map(addTodoAction, preventDefault(match('.add-todo', submit(el))))
  const remove = map(removeTodoAction, match('.destroy', clicks))
  const complete = map(updateTodoAction, match('.toggle', changes))
  const all = map(updateAllAction, match('.toggle-all', changes))
  const clear = map(clearCompleteAction, match('.clear-completed', clicks))

  return merge(add, remove, complete, all, clear)
}

//
// const editActions = el => {
//   const beginEdit = map(beginEditAction, match('label', dblclick(el)))
//
//   const editKey = match('.edit', keyup(el))
//   const blurEdit = match('.edit', focusout(el))
//   const enter = isKey(ENTER_KEY, editKey)
//   const saveEdit = map(endEditAction, merge(enter, blurEdit))
//
//   const abortEdit = map(abortEditAction, isKey(ESC_KEY, editKey))
//
//   return merge(beginEdit, saveEdit, abortEdit)
// }
//
const filterActions = window =>
  map(updateViewAction, hashchange(window))

const todos = (window, container, initialState) => {
  const actions = merge(listActions(container), filterActions(window))
  return scan(applyAction, initialState, actions)
}

const root = document.querySelector('.todoapp')
const container = root.parentNode

const patch = snabbdom.init([props, attrs, clss])
const updateApp = (node, state) => patch(node, render(state))

const initialState = { todos: [], editing: '', view: 'all' }

todos(window, container, initialState).scan(updateApp, root).drain()
