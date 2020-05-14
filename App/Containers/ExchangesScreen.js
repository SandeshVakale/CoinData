import React, { Component } from 'react'
import { ActivityIndicator, FlatList, Linking, View } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

import { Button, Header, Image, Overlay, Text } from 'react-native-elements'
import colors from '../Themes/Colors'
import { DateAndTime } from '../Components/DateAndTime'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import _ from 'lodash'
// import SvgUri from 'react-native-svg-uri'
import ExchangeActions from '../Redux/ExchangeRedux'
import FavoritesActions from '../Redux/FavoritesRedux'

class ExchangesScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isVisible: false
    }
  }

  componentDidMount () {
    const { exchangeRequest } = this.props
    exchangeRequest(100)
  }
  render () {
    const { stats, coins, exchange } = this.props
    if (exchange.fetching === false && exchange.payload && exchange.payload.data) {
      return (
        <View style={{ flex: 1 }}>
          <Header containerStyle={{ backgroundColor: colors.bloodOrange }}
            rightComponent={<DateAndTime />} centerComponent={{
              text: 'Exchanges',
              style: { color: colors.silver, fontWeight: '900', fontSize: 28 }
            }} leftComponent={<Icon
            // raised
              name='earth'
              size={34}
              color={colors.silver}
              onPress={() => this.setState({ isVisible: true })} />} />
          <FlatList data={exchange.payload.data.exchanges}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 15 }}
            initialNumToRender={20}
            renderItem={
                      (item) =>
                        <View style={{
                          padding: 5,
                          borderWidth: 1,
                          margin: 5,
                          borderColor: colors.bloodOrange,
                          borderRadius: 12 }} >
                          <View style={{
                            flexDirection: 'row'
                          }}>
                            <View style={{flex: 0.2, alignItems: 'center'}}>
                              { item.item.iconUrl !== null && <Image
                                source={{ uri: item.item.iconUrl.replace(/\.(svg)($|\?)/, '.png$2') }}
                                style={{ width: 50, height: 50, resizeMode: 'contain' }}
                                PlaceholderContent={<ActivityIndicator style={{backgroundColor: colors.transparent}} />}
                          />}
                            </View>
                            <View style={{ flex: 0.5, flexDirection: 'column' }}>
                              <Text
                                style={{ fontSize: 18, fontWeight: 'bold', color: colors.bloodOrange }}>{item.item.name}</Text>
                              <Text style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: colors.bloodOrange
                              }}>Markets {item.item.numberOfMarkets}</Text>
                            </View>
                            <View style={{ flex: 0.3, flexDirection: 'column' }}>
                              <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.bloodOrange }}>Share</Text>
                              <Text style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: colors.bloodOrange,
                                flex: 0.3
                              }}>{_.ceil(item.item.marketShare, 5)}</Text>
                            </View>
                          </View>
                          {item.item.description !== null && <Text style={{ padding: 5 }}>
                            {item.item.description}
                          </Text>}
                          {item.item.websiteUrl !== null && <Button icon={<Icon
                            style={{ paddingRight: 10 }}
                            name='web'
                            size={22}
                            color={colors.bloodOrange}
                          />}
                            onPress={() => Linking.openURL(item.item.websiteUrl)}
                            title={'Website'}
                            type={'Clear'}
                          />}
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
    stats: state.stats,
    coins: state.coins,
    exchange: state.exchange,
    favorites: state.favorites
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    exchangeRequest: (limit) => dispatch(ExchangeActions.exchangeRequest(limit)),
    addFavorite: (id) => dispatch(FavoritesActions.addFavorite(id)),
    removeFavorite: (id) => dispatch(FavoritesActions.removeFavorite(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExchangesScreen)
