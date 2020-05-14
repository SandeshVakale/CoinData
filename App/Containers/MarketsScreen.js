import React, { Component } from 'react'
import { ActivityIndicator, FlatList, View } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
import MarketActions from '../Redux/MarketRedux'

// Styles
import styles from './Styles/MarketsScreenStyle'
import { Text, Header, Overlay, Image } from 'react-native-elements'
import colors from '../Themes/Colors'
import { DateAndTime } from '../Components/DateAndTime'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import _ from 'lodash'
import ExchangeActions from '../Redux/ExchangeRedux'

class MarketsScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isVisible: false
    }
  }

  componentDidMount () {
    const { marketRequest } = this.props
    marketRequest(100)
  }
  render () {
    const { market, stats, coins } = this.props
    if (market.fetching === false && market.payload && market.payload.data) {
      return (
        <View style={{ flex: 1 }}>
          <Header containerStyle={{ backgroundColor: colors.bloodOrange }}
            rightComponent={<DateAndTime />} centerComponent={{
              text: 'Markets',
              style: { color: colors.silver, fontWeight: '900', fontSize: 28 }
            }} leftComponent={<Icon
            // raised
              name='earth'
              size={34}
              color={colors.silver}
              onPress={() => this.setState({ isVisible: true })} />} />
          <FlatList data={market.payload.data.markets}
            contentContainerStyle={{ paddingBottom: 15 }}
            showsVerticalScrollIndicator={false}
            initialNumToRender={20}
            renderItem={
                      (item) => <View style={{ flexDirection: 'row', padding: 5, borderWidth: 1, margin: 5, borderColor: colors.bloodOrange, borderRadius: 12}} >
                        <View style={{flex: 0.2, alignItems: 'center'}}>
                          { item.item.sourceIconUrl !== null && <Image
                            source={{ uri: item.item.sourceIconUrl.replace(/\.(svg)($|\?)/, '.png$2') }}
                            style={{ width: 50, height: 50, resizeMode: 'contain' }}
                            PlaceholderContent={<ActivityIndicator style={{ backgroundColor: colors.transparent }} />}
                          />}
                        </View>
                        <View style={{ flex: 0.5, flexDirection: 'column' }}>
                          <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.bloodOrange }} >{item.item.baseSymbol}/{item.item.quoteSymbol}</Text>
                          <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.bloodOrange }} >{item.item.sourceName}</Text>
                        </View>
                        <View style={{ flex: 0.3, flexDirection: 'column' }}>
                          <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.bloodOrange }} >Price</Text>
                          <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.bloodOrange, flex: 0.3 }} >{_.ceil(item.item.price, 5)}</Text>
                        </View>
                      </View>
                    } />
          <Overlay height={450} width={'95%'} isVisible={this.state.isVisible}
            onBackdropPress={() => this.setState({ isVisible: false })}>

            <Text h2 h2Style={{
              color: colors.bloodOrange,
              textAlign: 'center',
              fontWeight: '700'
            }}>Global Stats</Text>
            <View style={{
              flexDirection: 'column',
              justifyContent: 'space-around',
              flex: 1,
              backgroundColor: colors.transparent
            }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                padding: 10,
                backgroundColor: colors.transparent
              }}>
                <Text style={{
                  fontSize: 18,
                  color: colors.bloodOrange,
                  fontWeight: 'bold',
                  flex: 0.5
                }}>Totol Coins</Text>
                <Text style={{
                  fontSize: 18,
                  color: colors.bloodOrange,
                  fontWeight: 'bold',
                  textAlign: 'right',
                  right: 0,
                  flex: 0.5
                }}>{stats.payload.data.totalCoins}</Text>
              </View>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                padding: 10,
                backgroundColor: colors.transparent
              }}>
                <Text style={{
                  fontSize: 18,
                  color: colors.bloodOrange,
                  fontWeight: 'bold',
                  flex: 0.5
                }}>Totol Markets</Text>
                <Text style={{
                  fontSize: 18,
                  color: colors.bloodOrange,
                  fontWeight: 'bold',
                  textAlign: 'right',
                  right: 0,
                  flex: 0.5
                }}>{stats.payload.data.totalMarkets}</Text>
              </View>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                backgroundColor: colors.transparent,
                padding: 10
              }}>
                <Text style={{
                  fontSize: 18,
                  color: colors.bloodOrange,
                  fontWeight: 'bold',
                  flex: 0.5
                }}>Totol Exchanges</Text>
                <Text style={{
                  fontSize: 18,
                  color: colors.bloodOrange,
                  fontWeight: 'bold',
                  textAlign: 'right',
                  right: 0,
                  flex: 0.5
                }}>{_.ceil(stats.payload.data.totalExchanges, 2)}</Text>
              </View>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                backgroundColor: colors.transparent,
                padding: 10
              }}>
                <Text style={{
                  fontSize: 18,
                  color: colors.bloodOrange,
                  fontWeight: 'bold',
                  flex: 0.5
                }}>Totol Market Cap</Text>
                <Text style={{
                  fontSize: 18,
                  color: colors.bloodOrange,
                  fontWeight: 'bold',
                  textAlign: 'right',
                  right: 0,
                  flex: 0.5
                }}>{coins.payload.data.base.sign} {_.ceil(stats.payload.data.totalMarketCap, 2)}</Text>
              </View>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                backgroundColor: colors.transparent,
                padding: 10
              }}>
                <Text style={{
                  fontSize: 18,
                  color: colors.bloodOrange,
                  fontWeight: 'bold',
                  flex: 0.5
                }}>Totol 24h Volume</Text>
                <Text style={{
                  fontSize: 18,
                  color: colors.bloodOrange,
                  fontWeight: 'bold',
                  textAlign: 'right',
                  right: 0,
                  flex: 0.5
                }}>{coins.payload.data.base.sign} {_.ceil(stats.payload.data.total24hVolume, 2)}</Text>
              </View>
            </View>
          </Overlay>
        </View>
      )
    } else {
      return (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.bloodOrange
        }}>
          <ActivityIndicator color={colors.silver} />
        </View>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    market: state.market,
    stats: state.stats,
    coins: state.coins
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    marketRequest: (limit) => dispatch(MarketActions.marketRequest(limit))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MarketsScreen)
