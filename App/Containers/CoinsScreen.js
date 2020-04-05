import React, { Component } from 'react'
import { View, FlatList, TouchableHighlight } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import { Text, Header, Overlay } from 'react-native-elements'

// Styles
import colors from '../Themes/Colors'
import { DateAndTime } from '../Components/DateAndTime'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import _ from 'lodash'
import { Colors } from '../Themes'
import SvgUri from 'react-native-svg-uri'
import { LineChart } from 'react-native-chart-kit'
import CoinsActions from '../Redux/CoinsRedux'
import GlobalStatsActions from '../Redux/GlobalStatsRedux'

class CoinsScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isVisible: false,
      base: 'USD',
      timePeriod: '24h'
    }
  }

  // componentDidMount () {
  //   const { base, timePeriod } = this.state
  //   const { coinsRequest, globalStatsRequest } = this.props
  //   coinsRequest(base, timePeriod, null, null, 100, null)
  //   globalStatsRequest(base)
  // }
  render () {
    const { base, timePeriod } = this.state
    const { stats, coins } = this.props
    console.log('this props', this.props)
    return (
      <View style={{ flex: 1, backgroundColor: colors.silver }}>
        <Header containerStyle={{ backgroundColor: colors.bloodOrange }}
                rightComponent={<DateAndTime/>} centerComponent={{
          text: 'Coins',
          style: { color: colors.silver, fontWeight: '900', fontSize: 28 },
        }} leftComponent={<Icon
          // raised
          name='earth'
          size={34}
          color={colors.silver}
          onPress={() => this.setState({ isVisible: true })}/>}/>
        <FlatList data={coins.payload.data.coins}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{borderColor: Colors.coal, backgroundColor: colors.silver }}
                  renderItem={
                    (item) => <TouchableHighlight onPress={() => this.props.navigation.navigate(
                      'DetailScreen',
                      {
                        id: item.item.id,
                        base: base,
                        timePeriod: timePeriod,
                        color: item.item.color,
                      },
                    )}><View style={{ flexDirection: 'row', alignItems: 'center', padding: 3, borderWidth: 1, margin: 5, borderColor: item.item.color, borderRadius: 12}} >
                      <SvgUri
                        style={{ paddingRight: 5, flex: 0.2, alignItems: 'center'}}
                        width={40}
                        height={40}
                        source={{ uri: item.item.iconUrl }}
                      />
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
                                data: item.item.history,
                              },
                            ],
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
                            color: (opacity = 1) => Math.sign(item.item.change) === -1 ? colors.error : colors.lightgreen,
                          }}
                          style={{alignItems: 'center', marginLeft: -100}}
                        />
                      </View>
                      <View style={{ flex: 0.25, flexDirection: 'column' }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.bloodOrange }} >{coins.payload.data.base.sign} {_.ceil(item.item.price, 2)}</Text>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: Math.sign(item.item.change) === -1 ? colors.error : colors.lightgreen, flex: 0.3 }} >{item.item.change}%</Text>
                      </View>
                    </View>
                    </TouchableHighlight>
                  }/>
        <Overlay height={450} width={'95%'} isVisible={this.state.isVisible}
                 onBackdropPress={() => this.setState({ isVisible: false })}>
          <Text h2 h2Style={{
            color: colors.bloodOrange,
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
                color: colors.bloodOrange,
                fontWeight: 'bold',
                flex: 0.5,
              }}>Totol Coins</Text>
              <Text style={{
                fontSize: 18,
                color: colors.bloodOrange,
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
                color: colors.bloodOrange,
                fontWeight: 'bold',
                flex: 0.5,
              }}>Totol Markets</Text>
              <Text style={{
                fontSize: 18,
                color: colors.bloodOrange,
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
                color: colors.bloodOrange,
                fontWeight: 'bold',
                flex: 0.5,
              }}>Totol Exchanges</Text>
              <Text style={{
                fontSize: 18,
                color: colors.bloodOrange,
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
                color: colors.bloodOrange,
                fontWeight: 'bold',
                flex: 0.5,
              }}>Totol Market Cap</Text>
              <Text style={{
                fontSize: 18,
                color: colors.bloodOrange,
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
                color: colors.bloodOrange,
                fontWeight: 'bold',
                flex: 0.5,
              }}>Totol 24h Volume</Text>
              <Text style={{
                fontSize: 18,
                color: colors.bloodOrange,
                fontWeight: 'bold',
                textAlign: 'right',
                right: 0,
                flex: 0.5,
              }}>{coins.payload.data.base.sign} {_.ceil(stats.payload.data.total24hVolume, 2)}</Text>
            </View>
          </View>
        </Overlay>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    stats: state.stats,
    coins: state.coins
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    coinsRequest: (base, timePeriod, ids, sort, limit, order) => dispatch(CoinsActions.coinsRequest(base, timePeriod, ids, sort, limit, order)),
    globalStatsRequest: (base) => dispatch(GlobalStatsActions.globalStatsRequest(base))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CoinsScreen)
