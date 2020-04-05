import React, { Component } from 'react'
import { FlatList, View, Dimensions, ActivityIndicator, ScrollView, Linking, TouchableHighlight } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Colors } from '../Themes'
import { Button, Text, Header, Overlay, Divider } from 'react-native-elements'
import { connect } from 'react-redux'
import CoinsActions from '../Redux/CoinsRedux'
import GlobalStatsActions from '../Redux/GlobalStatsRedux'
import WinnersActions from '../Redux/WinnersRedux'
import LosersAction from '../Redux/LosersRedux'
import SvgUri from 'react-native-svg-uri'
import { DateAndTime } from '../Components/DateAndTime'
import _ from 'lodash'
import {
  LineChart,
} from 'react-native-chart-kit'

// Styles
import styles from './Styles/LaunchScreenStyles'
import colors from '../Themes/Colors'

const timePeriods = [
  '24h', '7d', '30d', '1y', '5y',
]

// const hours = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24 ]
// const days30 = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30 ]
// const days7 = [ 1, 2, 3, 4, 5, 6, 7 ]

const bases = [
  'USD', 'EUR', 'JPY', 'INR', 'GBP', 'CAD',
]

class LaunchScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      active: 0,
      base: 'USD',
      timePeriod: '24h',
      graphData: null,
      refresh: false,
      isVisible: false,
    }
  }

  componentDidMount () {
    const { base, timePeriod } = this.state
    const { coinsRequest, globalStatsRequest, winnersRequest, losersRequest } = this.props
    coinsRequest(base, timePeriod, null, null, 100, null)
    winnersRequest(base, timePeriod, 'change', 10, 'desc')
    losersRequest(base, timePeriod, 'change', 10, 'asc')
    globalStatsRequest(base)
  }

  reload = (item) => {
    const { base, refresh } = this.state
    const { coinsRequest, winnersRequest, losersRequest } = this.props
    this.setState({ timePeriod: item.item, refresh: !refresh })
    coinsRequest(base, item.item, null, null, 100, null)
    winnersRequest(base, item.item, 'change', 10, 'desc')
    losersRequest(base, item.item, 'change', 10, 'asc')
  }

  hotReload = (item) => {
    const { timePeriod, refresh } = this.state
    const { coinsRequest, globalStatsRequest, winnersRequest, losersRequest } = this.props
    this.setState({ base: item.item, refresh: !refresh })
    //console.log('item', item)
    coinsRequest(item.item, timePeriod, null, null, 100, null)
    globalStatsRequest(item.item)
    winnersRequest(item.item, timePeriod, 'change', 10, 'desc')
    losersRequest(item.item, timePeriod, 'change', 10, 'asc')
  }

  componentDidUpdate (prevProps) {
    const { coins } = this.props
    const { active } = this.state
    if (!_.isEqual(coins, prevProps.coins) && coins.fetching === false) {
      this.setState({ graphData: coins.payload.data.coins[active] })
    }
  }

  render () {
    const { coins, stats, winners, losers } = this.props
    const { graphData, timePeriod, refresh, base, active } = this.state
    // console.log('this.props launch', this.props)
    if (graphData === null && coins.fetching === false && coins.payload !== null) {
      this.setState({ graphData: coins.payload.data.coins[0] })
    }
    if (coins.fetching === false && coins.payload !== null && winners.fetching === false && losers.fetching === false) {
      return (
        <View style={{ flex: 1, backgroundColor: graphData && graphData.color ? graphData.color : colors.bloodOrange }}>
          {graphData &&
          <Header containerStyle={{ backgroundColor: graphData.color ? graphData.color : colors.bloodOrange }}
                  rightComponent={<DateAndTime/>} centerComponent={{
            text: 'coindata',
            style: { color: colors.silver, fontWeight: '900', fontSize: 28 },
          }} leftComponent={<Icon
            // raised
            name='earth'
            size={34}
            color={colors.silver}
            onPress={() => this.setState({ isVisible: true })}/>}/>}
          <ScrollView showsVerticalScrollIndicator={false}
                      style={{ backgroundColor: graphData && graphData.color ? graphData.color : colors.ember }}>
            <View>
              <FlatList data={coins.payload.data.coins} horizontal extraData={refresh}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ height: 50, borderColor: Colors.coal }}
                        renderItem={(item) => <Button
                          key={item.item.id}
                          titleStyle={{ color: colors.silver, fontWeight: active === item.index ? 'bold' : 'normal' }}
                          onPress={() => this.setState({ active: item.index, graphData: item.item, refresh: !refresh })}
                          buttonStyle={active === item.index ? styles.active : styles.deactive}
                          title={item.item.symbol}/>
                        }/>
            </View>
            <View style={{ alignItems: 'center' }}>
              {graphData && <LineChart
                data={{
                  // labels: timePeriod === '24h' ? hours : timePeriod === '7d' ? days7 : days30,
                  datasets: [
                    {
                      data: graphData.history,
                    },
                  ],
                }}
                withInnerLines={false}
                withDots={false}
                width={Dimensions.get('window').width} // from react-native
                height={280}
                yAxisLabel={coins.payload.data.base.sign}
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                  backgroundColor: graphData.color ? graphData.color : colors.bloodOrange,
                  backgroundGradientFrom: graphData.color ? graphData.color : colors.bloodOrange,
                  backgroundGradientTo: graphData.color ? graphData.color : colors.bloodOrange,
                  decimalPlaces: 2, // optional, defaults to 2dp
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: graphData.color ? graphData.color : colors.bloodOrange,
                  },
                }}
                bezier
                style={{}}
              />}
            </View>

            <View style={{ height: 100, alignItems: 'center', marginTop: -100 }}>
              <FlatList data={timePeriods} horizontal extraData={refresh}
                        style={{ height: 50 }}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ height: 50, borderColor: Colors.coal, marginTop: 50 }}
                        renderItem={(item) => <Button
                          key={item.item.id}
                          titleStyle={{
                            color: colors.silver,
                            fontWeight: timePeriod === item.item ? 'bold' : 'normal',
                          }}
                          onPress={() => this.reload(item)}
                          buttonStyle={timePeriod === item.item ? styles.active : styles.deactive}
                          title={(item.item).toUpperCase()}/>
                        }/>
            </View>

            <View style={{ height: 100, alignItems: 'center', marginTop: -10 }}>
              <FlatList data={bases} horizontal extraData={refresh}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ height: 50, borderColor: Colors.coal, marginTop: 50 }}
                        renderItem={(item) => <Button
                          key={item.item.id}
                          titleStyle={{ color: colors.silver, fontWeight: base === item.item ? 'bold' : 'normal' }}
                          onPress={() => this.hotReload(item)}
                          buttonStyle={base === item.item ? styles.active : styles.deactive}
                          title={item.item}/>
                        }/>
            </View>

            {graphData && svgBloack(graphData)}
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <Text style={{ color: colors.silver, textAlign: 'center', fontSize: 14 }}>Price</Text>
              <Text style={{ color: colors.silver, textAlign: 'center', fontSize: 14 }}>Change</Text>
            </View>
            {graphData && <View
              style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: -15 }}>
              <Text h3 h3Style={{
                color: colors.silver,
                width: '49%',
                textAlign: 'center',
                fontSize: 20,
              }}>{coins.payload.data.base.sign + _.ceil(graphData.price, 2)}</Text>
              <View style={{ height: 70, width: 1, marginTop: -10, backgroundColor: colors.silver }}/>
              <Text h3 h3Style={{
                color: colors.silver,
                width: '49%',
                textAlign: 'center',
                fontSize: 20,
              }}>{_.ceil(graphData.change, 2) + '%'}</Text>
            </View>}

            {graphData &&
            <Text style={{ color: colors.silver, fontSize: 18, padding: 15 }}>{graphData.description}</Text>}
            {graphData && graphData.websiteUrl !== '' && graphData.websiteUrl !== null && <Button icon={<Icon
              style={{ paddingRight: 10 }}
              name="web"
              size={22}
              color={graphData.color ? graphData.color : colors.bloodOrange}
            />}
                                                                                                  onPress={() => Linking.openURL(graphData.websiteUrl)}
                                                                                                  buttonStyle={{
                                                                                                    backgroundColor: colors.silver,
                                                                                                    marginVertical: 10,
                                                                                                    paddingHorizontal: 30,
                                                                                                    width: '80%',
                                                                                                    alignSelf: 'center',
                                                                                                  }} title={'Website'}
                                                                                                  titleStyle={{ color: graphData.color }}/>}
            {graphData && <Button onPress={() => this.props.navigation.navigate('DetailScreen', {
              id: graphData.id,
              base: base,
              timePeriod: timePeriod,
              color: graphData.color,
            })} buttonStyle={{
              backgroundColor: colors.transparent,
              borderColor: colors.silver,
              borderWidth: 2,
              marginVertical: 10,
              paddingHorizontal: 30,
              width: '80%',
              alignSelf: 'center',
            }} title={'Know More about ' + graphData.name} titleStyle={{ color: colors.silver, fontWeight: 'bold' }}/>}

            <Button icon={<Icon
              style={{ paddingRight: 10 }}
              name="home"
              size={22}
              color={colors.silver}
            />}
              onPress={() => this.props.navigation.navigate('postStack')} buttonStyle={{
              backgroundColor: colors.transparent,
              borderColor: colors.transparent,
              borderWidth: 2,
              marginVertical: 10,
              paddingHorizontal: 30,
              width: '80%',
              alignSelf: 'center',
            }} title={'Get Started'} titleStyle={{ color: colors.silver, fontWeight: 'bold' }}/>

            {graphData && stats.fetching === false &&
            <Overlay height={450} width={'95%'} isVisible={this.state.isVisible}
                     onBackdropPress={() => this.setState({ isVisible: false })}>
              <Text h2 h2Style={{
                color: graphData.color ? graphData.color : colors.bloodOrange,
                textAlign: 'center',
                fontWeight: '700',
              }}>Global Stats</Text>
              <View style={{
                flexDirection: 'column',
                justifyContent: 'space-around',
                flex: 1,
                backgroundColor: colors.transparent,
              }}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  padding: 10,
                  backgroundColor: colors.transparent,
                }}>
                  <Text style={{
                    fontSize: 18,
                    color: graphData.color ? graphData.color : colors.bloodOrange,
                    fontWeight: 'bold',
                    flex: 0.5,
                  }}>Totol Coins</Text>
                  <Text style={{
                    fontSize: 18,
                    color: graphData.color ? graphData.color : colors.bloodOrange,
                    fontWeight: 'bold',
                    textAlign: 'right',
                    right: 0,
                    flex: 0.5,
                  }}>{stats.payload.data.totalCoins}</Text>
                </View>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  padding: 10,
                  backgroundColor: colors.transparent,
                }}>
                  <Text style={{
                    fontSize: 18,
                    color: graphData.color ? graphData.color : colors.bloodOrange,
                    fontWeight: 'bold',
                    flex: 0.5,
                  }}>Totol Markets</Text>
                  <Text style={{
                    fontSize: 18,
                    color: graphData.color ? graphData.color : colors.bloodOrange,
                    fontWeight: 'bold',
                    textAlign: 'right',
                    right: 0,
                    flex: 0.5,
                  }}>{stats.payload.data.totalMarkets}</Text>
                </View>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  backgroundColor: colors.transparent,
                  padding: 10,
                }}>
                  <Text style={{
                    fontSize: 18,
                    color: graphData.color ? graphData.color : colors.bloodOrange,
                    fontWeight: 'bold',
                    flex: 0.5,
                  }}>Totol Exchanges</Text>
                  <Text style={{
                    fontSize: 18,
                    color: graphData.color ? graphData.color : colors.bloodOrange,
                    fontWeight: 'bold',
                    textAlign: 'right',
                    right: 0,
                    flex: 0.5,
                  }}>{_.ceil(stats.payload.data.totalExchanges, 2)}</Text>
                </View>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  backgroundColor: colors.transparent,
                  padding: 10,
                }}>
                  <Text style={{
                    fontSize: 18,
                    color: graphData.color ? graphData.color : colors.bloodOrange,
                    fontWeight: 'bold',
                    flex: 0.5,
                  }}>Totol Market Cap</Text>
                  <Text style={{
                    fontSize: 18,
                    color: graphData.color ? graphData.color : colors.bloodOrange,
                    fontWeight: 'bold',
                    textAlign: 'right',
                    right: 0,
                    flex: 0.5,
                  }}>{coins.payload.data.base.sign} {_.ceil(stats.payload.data.totalMarketCap, 2)}</Text>
                </View>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  backgroundColor: colors.transparent,
                  padding: 10,
                }}>
                  <Text style={{
                    fontSize: 18,
                    color: graphData.color ? graphData.color : colors.bloodOrange,
                    fontWeight: 'bold',
                    flex: 0.5,
                  }}>Totol 24h Volume</Text>
                  <Text style={{
                    fontSize: 18,
                    color: graphData.color ? graphData.color : colors.bloodOrange,
                    fontWeight: 'bold',
                    textAlign: 'right',
                    right: 0,
                    flex: 0.5,
                  }}>{coins.payload.data.base.sign} {_.ceil(stats.payload.data.total24hVolume, 2)}</Text>
                </View>
              </View>
            </Overlay>}

            <Divider style={{ backgroundColor: colors.silver, marginTop: 15 }}/>

            <Text h4 h4Style={{ color: colors.silver, fontWeight: 'bold', padding: 10 }}>{timePeriod.toUpperCase()} Winners</Text>
            <View>
              <FlatList data={winners.payload.data.coins.slice(0, 10)} horizontal extraData={refresh}
                        showsHorizontalScrollIndicator={false}

                // contentContainerStyle={{ height: 50, borderColor: Colors.coal }}
                        renderItem={(item) =>
                          <TouchableHighlight
                            onPress={() => this.props.navigation.navigate('DetailScreen', {
                              id: item.item.id,
                              base: base,
                              timePeriod: timePeriod,
                              color: item.item.color,
                            })}
                          >
                          <View style={{
                            flexDirection: 'column',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            alignContent: 'center',
                            height: 100,
                            width: 200,
                            marginHorizontal: 10,
                            borderRadius: 12,
                            borderWidth: 2,
                            borderColor: colors.silver,
                            backgroundColor: graphData ? graphData.color : colors.bloodOrange,
                          }}>
                            <Text h4 h4Style={{
                              color: colors.lightgreen,
                              fontWeight: 'bold',
                            }}>{item.item.change} %</Text>
                            <View style={{
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                              alignContent: 'center',
                            }}>
                              <SvgUri
                                style={{ paddingRight: 5, flex: 0.5, alignItems: 'center'}}
                                width={40}
                                height={40}
                                source={{ uri: item.item.iconUrl }}
                              />
                              <View style={{
                                flexDirection: 'column',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                alignContent: 'center',
                                flex: 0.5
                              }}>
                                <Text numberOfLines={1} h4 h4Style={{ color: colors.silver, fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>{item.item.name}</Text>
                                <Text style={{
                                  color: colors.silver,
                                  fontSize: 14,
                                  textAlign: 'center'
                                }}>{coins.payload.data.base.sign}{_.ceil(item.item.price, 2)}</Text>
                              </View>
                            </View>
                          </View>
                          </TouchableHighlight>
                          }/>

            </View>


            <Divider style={{ backgroundColor: colors.silver, marginTop: 15 }}/>
            <Text h4 h4Style={{ color: colors.silver, fontWeight: 'bold', padding: 10 }}>{timePeriod.toUpperCase()} Losers</Text>
            <View>
              <FlatList data={losers.payload.data.coins.slice(Math.max(losers.payload.data.coins.length - 10, 0))} horizontal extraData={refresh}
                        showsHorizontalScrollIndicator={false}
                // contentContainerStyle={{ height: 50, borderColor: Colors.coal }}
                        renderItem={(item) =>
                          <TouchableHighlight
                            onPress={() => this.props.navigation.navigate('DetailScreen', {
                              id: item.item.id,
                              base: base,
                              timePeriod: timePeriod,
                              color: item.item.color,
                            })}
                          >
                          <View style={{
                            flexDirection: 'column',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            alignContent: 'center',
                            height: 100,
                            width: 200,
                            marginHorizontal: 10,
                            borderRadius: 12,
                            borderWidth: 2,
                            borderColor: colors.silver,
                            backgroundColor: graphData ? graphData.color : colors.bloodOrange,
                          }}>
                            <Text h4 h4Style={{
                              color: colors.error,
                              fontWeight: 'bold',
                            }}>{item.item.change} %</Text>
                            <View style={{
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                              alignContent: 'center',
                            }}>
                              <SvgUri
                                style={{ paddingRight: 5, flex: 0.5, alignItems: 'center'}}
                                width={40}
                                height={40}
                                source={{ uri: item.item.iconUrl }}
                              />
                              <View style={{
                                flexDirection: 'column',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                alignContent: 'center',
                                flex: 0.5
                              }}>
                                <Text numberOfLines={1} h4 h4Style={{ color: colors.silver, fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>{item.item.name}</Text>
                                <Text style={{
                                  color: colors.silver,
                                  fontSize: 14,
                                  textAlign: 'center'
                                }}>{coins.payload.data.base.sign}{_.ceil(item.item.price, 2)}</Text>
                              </View>
                            </View>
                          </View>
                          </TouchableHighlight>}/>

            </View>
            <View style={{
              height: 100,
              backgroundColor: graphData && graphData.color ? graphData.color : colors.bloodOrange,
            }}/>
          </ScrollView>
        </View>
      )
    } else {
      return (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: graphData ? graphData.color : colors.bloodOrange,
        }}>
          <ActivityIndicator color={Colors.silver}/>
        </View>
      )
    }
  }
}

const svgBloack = (data) => {
  return (
    <View style={{ paddingTop: 10, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
      <SvgUri
        style={{ flex: 0.5, alignItems: 'center' }}
        width={60}
        height={60}
        source={{ uri: data.iconUrl }}
      />
      <Text h4 h4Style={{ fontWeight: 'bold', color: colors.silver, flex: 0.5, textAlign: 'center' }}>{data.name}</Text>
    </View>
  )
}

const mapStateToProps = (state) => {
  return {
    coins: state.coins,
    stats: state.stats,
    winners: state.winners,
    losers: state.losers
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    coinsRequest: (base, timePeriod, ids, sort, limit, order) => dispatch(CoinsActions.coinsRequest(base, timePeriod, ids, sort, limit, order)),
    globalStatsRequest: (base) => dispatch(GlobalStatsActions.globalStatsRequest(base)),
    winnersRequest: (base, timePeriod, sort, limit, order) => dispatch(WinnersActions.winnersRequest(base, timePeriod, sort, limit, order)),
    losersRequest: (base, timePeriod, sort, limit, order) => dispatch(LosersAction.losersRequest(base, timePeriod, sort, limit, order))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LaunchScreen)

