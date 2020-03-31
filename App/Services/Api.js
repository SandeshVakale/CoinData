// a library to wrap and simplify api calls
import apisauce from 'apisauce'
import Config from '../Config/AppConfig'

// our "constructor"
const create = (baseURL = Config.BASE_URL) => {
  // ------
  // STEP 1
  // ------
  //
  // Create and configure an apisauce-based api object.
  //
  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    // here are some default headers
    headers: {
      'Cache-Control': 'no-cache'
    },
    // 10 second timeout...
    timeout: 10000
  })

  // ------
  // STEP 2
  // ------
  //
  // Define some functions that call the api.  The goal is to provide
  // a thin wrapper of the api layer providing nicer feeling functions
  // rather than "get", "post" and friends.
  //
  // I generally don't like wrapping the output at this level because
  // sometimes specific actions need to be take on `403` or `401`, etc.
  //
  // Since we can't hide from that, we embrace it by getting out of the
  // way at this level.
  //
  const getRoot = () => api.get('')
  const getRate = () => api.get('rate_limit')
  const getUser = (username) => api.get('search/users', {q: username})
  const getCoins = ({base, timePeriod, ids, sort, limit, order}) => api.get('/coins', {base, timePeriod, ids, sort, limit, order})
  const getGlobalStats = ({base}) => api.get('/stats', {base})
  const getCoin = ({ coin_id, base, timePeriod }) => api.get(`/coin/${coin_id}`, { base, timePeriod })
  const getCoinHistory = ({ coin_id, timeframe, base }) => api.get(`/coin/${coin_id}/history/${timeframe}`, {base})
  const getWinners = ({ base, timePeriod, sort, limit, order }) => api.get('/coins', {base, timePeriod, sort, limit, order})
  const getLosers = ({ base, timePeriod, sort, limit, order }) => api.get('/coins', {base, timePeriod, sort, limit, order})
  const getMarkets = ({ refCurrencyId, baseCurrencyId, limit }) => api.get('/markets', {refCurrencyId, baseCurrencyId, limit})
  const getExchanges = ({ refCurrencyId, limit }) => api.get('/exchanges', { refCurrencyId, limit })

  // ------
  // STEP 3
  // ------
  //
  // Return back a collection of functions that we would consider our
  // interface.  Most of the time it'll be just the list of all the
  // methods in step 2.
  //
  // Notice we're not returning back the `api` created in step 1?  That's
  // because it is scoped privately.  This is one way to create truly
  // private scoped goodies in JavaScript.
  //
  return {
    // a list of the API functions from step 2
    getRoot,
    getRate,
    getUser,
    getCoins,
    getGlobalStats,
    getCoin,
    getCoinHistory,
    getWinners,
    getLosers,
    getMarkets,
    getExchanges
  }
}

// let's return back our create method as the default.
export default {
  create
}
