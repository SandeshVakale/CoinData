import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import configureStore from './CreateStore'
import rootSaga from '../Sagas/'
import ReduxPersist from '../Config/ReduxPersist'

/* ------------- Assemble The Reducers ------------- */
export const reducers = combineReducers({
  nav: require('./NavigationRedux').reducer,
  github: require('./GithubRedux').reducer,
  search: require('./SearchRedux').reducer,
  coins: require('./CoinsRedux').reducer,
  stats: require('./GlobalStatsRedux').reducer,
  coin: require('./CoinRedux').reducer,
  coinHistory: require('./CoinHistoryRedux').reducer,
  winners: require('./WinnersRedux').reducer,
  losers: require('./LosersRedux').reducer,
  markets: require('./MarketsRedux').reducer,
  exchanges: require('./ExchangesRedux').reducer,
  exchange: require('./ExchangeRedux').reducer,
  market: require('./MarketRedux').reducer,
  favorites: require('./FavoritesRedux').reducer,
  favoritesCoins: require('./FavoritesCoinsRedux').reducer
})

export default () => {
  let finalReducers = reducers
  // If rehydration is on use persistReducer otherwise default combineReducers
  if (ReduxPersist.active) {
    const persistConfig = ReduxPersist.storeConfig
    finalReducers = persistReducer(persistConfig, reducers)
  }

  let { store, sagasManager, sagaMiddleware } = configureStore(finalReducers, rootSaga)

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('./').reducers
      store.replaceReducer(nextRootReducer)

      const newYieldedSagas = require('../Sagas').default
      sagasManager.cancel()
      sagasManager.done.then(() => {
        sagasManager = sagaMiddleware(newYieldedSagas)
      })
    })
  }

  return store
}
