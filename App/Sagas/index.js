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

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { getUserAvatar } from './GithubSagas'
import { getCoins } from './CoinsSagas'
import { getGlobalStats } from './GlobalStatsSagas'
import { getCoin } from './CoinSagas'
import { getCoinHistory } from './CoinHistorySagas'
import { getLosers } from './LosersSagas'
import { getWinners } from './WinnersSagas'
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
    takeEvery(CoinsTypes.COINS_REQUEST, getCoins, api),
    takeEvery(GlobalStatsTypes.GLOBAL_STATS_REQUEST, getGlobalStats, api),
    takeLatest(CoinTypes.COIN_REQUEST, getCoin, api),
    takeLatest(CoinHistoryTypes.COIN_HISTORY_REQUEST, getCoinHistory, api),
    takeLatest(WinnersTypes.WINNERS_REQUEST, getWinners, api),
    takeLatest(LosersTypes.LOSERS_REQUEST, getLosers, api)
  ])
}
