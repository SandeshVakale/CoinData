import { takeLatest, all, takeEvery } from 'redux-saga/effects'
import API from '../Services/Api'
import FixtureAPI from '../Services/FixtureApi'
import DebugConfig from '../Config/DebugConfig'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'
import { GithubTypes } from '../Redux/GithubRedux'
import { CoinsTypes } from '../Redux/CoinsRedux'
import { GlobalStatsTypes } from '../Redux/GlobalStatsRedux'
import { CoinTypes } from '../Redux/CoinRedux'
import { CoinHistoryTypes } from '../Redux/CoinHistoryRedux'
import { LosersTypes } from '../Redux/LosersRedux'
import { WinnersTypes } from '../Redux/WinnersRedux'
import { MarketsTypes } from '../Redux/MarketsRedux'
import { ExchangesTypes } from '../Redux/ExchangesRedux'
import { ExchangeTypes } from '../Redux/ExchangeRedux'
import { MarketTypes } from '../Redux/MarketRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { getUserAvatar } from './GithubSagas'
import { getCoins } from './CoinsSagas'
import { getGlobalStats } from './GlobalStatsSagas'
import { getCoin } from './CoinSagas'
import { getCoinHistory } from './CoinHistorySagas'
import { getLosers } from './LosersSagas'
import { getWinners } from './WinnersSagas'
import { getMarkets } from './MarketsSagas'
import { getExchanges } from './ExchangesSagas'
import { getExchange } from './ExchangeSagas'
import { getMarket } from './MarketSagas'
/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = DebugConfig.useFixtures ? FixtureAPI : API.create()

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),
    // some sagas receive extra parameters in addition to an action
    takeLatest(GithubTypes.USER_REQUEST, getUserAvatar, api),
    takeLatest(CoinsTypes.COINS_REQUEST, getCoins, api),
    takeLatest(GlobalStatsTypes.GLOBAL_STATS_REQUEST, getGlobalStats, api),
    takeLatest(CoinTypes.COIN_REQUEST, getCoin, api),
    takeLatest(CoinHistoryTypes.COIN_HISTORY_REQUEST, getCoinHistory, api),
    takeLatest(WinnersTypes.WINNERS_REQUEST, getWinners, api),
    takeLatest(LosersTypes.LOSERS_REQUEST, getLosers, api),
    takeLatest(MarketsTypes.MARKETS_REQUEST, getMarkets, api),
    takeLatest(ExchangesTypes.EXCHANGES_REQUEST, getExchanges, api),
    takeLatest(ExchangeTypes.EXCHANGE_REQUEST, getExchange, api),
    takeLatest(MarketTypes.MARKET_REQUEST, getMarket, api)
  ])
}
