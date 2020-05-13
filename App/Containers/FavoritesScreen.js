import React, { Component } from 'react'
import { View, FlatList, TouchableHighlight, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import { Text, Header, Overlay, Image } from 'react-native-elements'
import colors from '../Themes/Colors'
import { DateAndTime } from '../Components/DateAndTime'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import _ from 'lodash'
import FavoritesCoinsActions from '../Redux/FavoritesCoinsRedux'
import { Colors } from '../Themes'
import { LineChart } from 'react-native-chart-kit'
import FavoritesActions from '../Redux/FavoritesRedux'

class FavoritesScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isVisible: false
    }
  }
  containsFavorites (id) {
    const { favorites } = this.props
    let i
    if (favorites && favorites.favorites) {
      for (i = 0; i < favorites.favorites.length; i++) {
        if (favorites.favorites[i].id === id) {
          return true
        }
      }
    }
    return false
  }

  componentDidMount () {
    const { favorites, favoritesCoinsRequest } = this.props
    if (favorites && favorites.favorites && favorites.favorites.length > 0) {
      let str = favorites.favorites.map((i) => i.id)
      favoritesCoinsRequest(str.join(','))
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const { favorites, favoritesCoinsRequest } = this.props
    console.log('favorites', favorites.favorites, prevProps.favorites.favorites)
    if (prevProps.favorites && prevProps.favorites.favorites && favorites && favorites.favorites && prevProps.favorites.favorites.length !== favorites.favorites.length) {
      let str = favorites.favorites.map((i) => i.id)
      favoritesCoinsRequest(str.join(','))
    }
  }

  render () {
    const { stats, coins, favoritesCoins, favorites, removeFavorite, addFavorite } = this.props
    // console.log('favoritesCoins', favoritesCoins)
    const { base, timePeriod } = this.state
    if (favorites && favorites.favorites && favorites.favorites.length > 0 && favoritesCoins && favoritesCoins.fetching === false && favoritesCoins.payload !== null && favoritesCoins.payload.data && favoritesCoins.payload.data.coins.length > 0) {
      return (
        <View style={{ flex: 1 }}>
          <Header containerStyle={{ backgroundColor: colors.bloodOrange }}
            rightComponent={<DateAndTime />} centerComponent={{
              text: 'Favorites',
              style: { color: colors.silver, fontWeight: '900', fontSize: 28 }
            }} leftComponent={<Icon
            // raised
              name='earth'
              size={34}
              color={colors.silver}
              onPress={() => this.setState({ isVisible: true })} />} />
          <FlatList data={favoritesCoins.payload.data.coins}
                    // initialNumToRender={20}
            keyExtractor={(item, index) => index}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{borderColor: Colors.coal, backgroundColor: colors.silver }}
            renderItem={
                      (item) => <TouchableHighlight onPress={() => this.props.navigation.navigate(
                        'DetailScreen',
                        {
                          id: item.item.id,
                          base: base,
                          timePeriod: timePeriod,
                          color: item.item.color
                        }
                      )}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 3, borderWidth: 1, margin: 5, borderColor: item.item.color, borderRadius: 12}} >
                          <View style={{flex: 0.2, alignItems: 'center'}}>
                            { item.item.iconUrl !== null && <Image
                              source={{ uri: item.item.iconUrl.replace(/\.(svg)($|\?)/, '.png$2') }}
                              style={{ width: 50, height: 50, resizeMode: 'contain' }}
                              PlaceholderContent={<ActivityIndicator style={{ backgroundColor: colors.transparent }} />}
                            /> }
                          </View>
                          <View style={{ flex: 0.25, flexDirection: 'column', zIndex: 10 }}>
                            <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: 'bold', color: colors.bloodOrange }} >{item.item.name}</Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: item.item.color }} >{item.item.symbol}</Text>
                          </View>
                          <View style={{ alignItems: 'center', flex: 0.3 }}>
                            <LineChart
                              data={{
                                // labels: timePeriod === '24h' ? hours : timePeriod === '7d' ? days7 : days30,
                                datasets: [
                                  {
                                    data: item.item.history
                                  }
                                ]
                              }}
                              withInnerLines={false}
                              withDots={false}
                              withOuterLines={false}
                              withVerticalLabels={false}
                              withHorizontalLabels={false}
                              withShadow={false}
                              width={150} // from react-native
                              height={60}
                              yAxisInterval={1} // optional, defaults to 1
                              chartConfig={{
                                backgroundColor: colors.bloodOrange,
                                backgroundGradientFrom: colors.silver,
                                backgroundGradientTo: colors.silver,
                                decimalPlaces: 2, // optional, defaults to 2dp
                                color: (opacity = 1) => Math.sign(item.item.change) === -1 ? colors.error : colors.lightgreen
                              }}
                              style={{alignItems: 'center', marginLeft: -100}}
                            />
                          </View>
                          <View style={{ flex: 0.25, flexDirection: 'column' }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.bloodOrange }} >{coins.payload.data.base.sign} {_.ceil(item.item.price, 2)}</Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: Math.sign(item.item.change) === -1 ? colors.error : colors.lightgreen, flex: 0.3 }} >{item.item.change}%</Text>
                          </View>
                          <TouchableHighlight onPress={() => { this.containsFavorites(item.item.id) ? removeFavorite(item.item.id) : addFavorite(item.item.id) }} style={{ backgroundColor: colors.transparent, position: 'absolute', bottom: 5, right: 3 }}>
                            <Icon color={colors.bloodOrange} size={25} name={this.containsFavorites(item.item.id) ? 'star' : 'star-outline'} />
                          </TouchableHighlight>
                        </View>
                      </TouchableHighlight>
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
      const { stats, coins } = this.props
      return (
        <View>
          <Header containerStyle={{ backgroundColor: colors.bloodOrange }}
                  rightComponent={<DateAndTime />} centerComponent={{
            text: 'Favorites',
            style: { color: colors.silver, fontWeight: '900', fontSize: 28 }
          }} leftComponent={<Icon
            // raised
            name='earth'
            size={34}
            color={colors.silver}
            onPress={() => this.setState({ isVisible: true })} />} />
          <Text style={{ textAlign: 'center' }}>Click on coins<Icon name={'star-outline'} color={colors.bloodOrange} size={25} /> to add favorites</Text>
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
    }
  }
}

const mapStateToProps = (state) => {
  return {
    stats: state.stats,
    coins: state.coins,
    favorites: state.favorites,
    favoritesCoins: state.favoritesCoins
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    favoritesCoinsRequest: (ids) => dispatch(FavoritesCoinsActions.favoritesCoinsRequest(ids)),
    addFavorite: (id) => dispatch(FavoritesActions.addFavorite(id)),
    removeFavorite: (id) => dispatch(FavoritesActions.removeFavorite(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FavoritesScreen)
