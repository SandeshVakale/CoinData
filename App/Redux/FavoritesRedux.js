import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import _ from 'lodash'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  addFavorite: ['id'],
  removeFavorite: ['id']
})

export const FavoritesTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  favorites: []
})

/* ------------- Reducers ------------- */

// request the avatar for a user
export const addFavorite = (state, action) => {
  const {id} = action
  const logfavorites = {
    id: id
  }
  return state.merge({...state, favorites: [...state.favorites, logfavorites]})
}

// successful avatar lookup
export const removeFavorite = (state, action) => {
  const { id } = action
  const logfavorites = _.filter(state.favorites, function (offer) {
    return id !== offer.id
  })

  return state.merge({favorites: logfavorites})
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ADD_FAVORITE]: addFavorite,
  [Types.REMOVE_FAVORITE]: removeFavorite
})
