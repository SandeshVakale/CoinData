import React, { Component } from 'react'
import { View, ActivityIndicator, Dimensions, FlatList, ScrollView, Linking } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import CoinActions from '../Redux/CoinRedux'
import { Button, Text, Header, Divider } from 'react-native-elements'
import {DateAndTime} from '../Components/DateAndTime'
import _ from 'lodash'
import moment from 'moment'

// Styles
import styles from './Styles/DetailScreenStyle'
import colors from '../Themes/Colors'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { LineChart } from 'react-native-chart-kit'
import { Colors } from '../Themes'

const timePeriods = [
  '24h','7d','30d', '1y', '5y'
]

const bases = [
  'USD','EUR', 'JPY', 'INR', 'GBP', 'CAD'
]

class DetailScreen extends Component {
  constructor (props) {
    super(props);
    const { id, base, timePeriod, color } = this.props.navigation.state.params
    this.state = {
      id: id,
      base: base,
      timePeriod: timePeriod,
      color: color,
      refresh: false
    }
  }

  componentDidMount () {
    const { coinRequest } = this.props
    const {base, timePeriod, id} = this.state
    coinRequest(id, base, timePeriod)
  }

  reload = (item) => {
    const {base, refresh, id} = this.state
    const {coinRequest} = this.props
    this.setState({ timePeriod: item.item, refresh: !refresh })
    coinRequest(id, base, item.item)
  }

  hotReload = (item) => {
    const {timePeriod, refresh, id} = this.state
    const {coinRequest} = this.props
    this.setState({ base: item.item, refresh: !refresh })
    //console.log('item', item)
    coinRequest(id, item.item, timePeriod)
  }

  render () {
    const { coin } = this.props
    const { color, base, timePeriod, refresh } = this.state
    console.log(coin)
    if ( coin.fetching === false &&  coin.payload && coin.payload.data ) {
      let data = coin.payload.data.coin
      return (
        <View style={{ flex: 1, backgroundColor: color ? color : colors.bloodOrange }}>
          <Header containerStyle={{ backgroundColor: color ? color : colors.bloodOrange }} rightComponent={<DateAndTime />} leftComponent={<Icon
            // raised
            name='arrow-left'
            size={34}
            color={colors.silver}
            onPress={() => this.props.navigation.goBack()} />}
            centerComponent={{ text: data.name, style: { color: colors.silver, fontWeight: '900', fontSize: 28 } }}/>
            <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor: color ? color : colors.bloodOrange}} >
            <View style={{padding: 10}} >
              <Text style={{ fontSize: 18, backgroundColor: color, fontWeight: 'bold', color: colors.silver }}>Price</Text>
                <View style={{ backgroundColor: color, flexDirection: 'row', alignItems: 'center' }} >
                  <Text h4 h4Style={{ backgroundColor: color, color: colors.silver, fontWeight: 'bold' }} >{coin.payload.data.base.sign} {_.ceil(data.price, 2)}</Text>
                  <Text style={{fontSize: 18, fontWeight: 'bold', color: Math.sign(data.change) === -1 ? colors.error: colors.lightgreen, paddingLeft: 15}} >{data.change}%</Text>
                </View>
            </View>
          <View style={{ alignItems: 'center' }}>
            {data && <LineChart
              data={{
                datasets: [
                  {
                    data: data.history
                  }
                ]
              }}
              withDots={false}
              width={Dimensions.get("window").width} // from react-native
              height={280}
              yAxisLabel={coin.payload.data.base.sign}
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundColor: color ? color : colors.bloodOrange,
                backgroundGradientFrom: color ? color : colors.bloodOrange,
                backgroundGradientTo: color ? color : colors.bloodOrange,
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  // borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: color ? color : colors.bloodOrange
                }
              }}
              bezier
              style={{
              }}
            />}
          </View>
          <View style={{height: 100, alignItems: 'center', marginTop: -100}}>
            <FlatList data={timePeriods} horizontal extraData={refresh}
                      style={{height: 50}}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ height: 50, borderColor: Colors.coal, marginTop: 50 }}
                      renderItem={(item) => <Button
                        key={item.item.id}
                        titleStyle={{ color: colors.silver, fontWeight: timePeriod === item.item ? 'bold' : 'normal'}}
                        onPress={() => this.reload(item)}
                        buttonStyle={timePeriod === item.item ? styles.active : styles.deactive}
                        title={(item.item).toUpperCase()}/>
                      }/>
          </View>

          <View style={{height: 100, alignItems: 'center', marginTop: -10}}>
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

              <View style={{padding: 10}} >
                <Text style={{ fontSize: 18, backgroundColor: color, fontWeight: 'bold', color: colors.silver }}>{(timePeriod).toUpperCase() + ' all time high'}</Text>
                <View style={{ backgroundColor: color, flexDirection: 'row', alignItems: 'center' }} >
                  <Text h4 h4Style={{ backgroundColor: color, color: colors.silver, fontWeight: 'bold' }} >{coin.payload.data.base.sign} {_.ceil(data.allTimeHigh.price, 2)}</Text>
                  {/*<Text style={{fontSize: 18, fontWeight: 'bold', color: colors.silver, paddingLeft: 15}} >{moment.unix(data.allTimeHigh.timestamp).format("MM/DD/YY")}</Text>*/}
                </View>
              </View>
          <Text h4 h4Style={{color: colors.silver, fontWeight: 'bold', padding: 10}} >About {data.name}</Text>
          <Text style={{color: colors.silver, fontSize: 18, paddingHorizontal: 10, paddingBottom: 10}}>{data.description}</Text>
          <Divider style={{ backgroundColor: colors.silver }} />
          <Text h4 h4Style={{color: colors.silver, fontWeight: 'bold', padding: 10}} >Market Stats</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: 10, backgroundColor: colors.transparent}} >
                <View style={{ flex: 0.5, flexDirection: 'row', alignItems: 'center' }}>
                  <Icon size={24} style={{paddingHorizontal: 5}} name={'chart-bar'} color={colors.silver} />
                <Text style={{ fontSize: 18, color: colors.silver, fontWeight: 'bold'}}>Market Capital</Text>
                </View>
                <Text style={{ fontSize: 18, color: colors.silver, fontWeight: 'bold', textAlign: 'right', right: 0, flex: 0.5 }}>{coin.payload.data.base.sign} {data.marketCap}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: 10, backgroundColor: colors.transparent}} >
                <View style={{ flex: 0.5, flexDirection: 'row', alignItems: 'center' }}>
                  <Icon size={24} style={{paddingHorizontal: 5}} name={'chart-bar-stacked'} color={colors.silver} />
                  <Text style={{ fontSize: 18, color: colors.silver, fontWeight: 'bold'}}>Volume</Text>
                </View>
                <Text style={{ fontSize: 18, color: colors.silver, fontWeight: 'bold', textAlign: 'right', right: 0, flex: 0.5 }}>{coin.payload.data.base.sign} {data.volume}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: 10, backgroundColor: colors.transparent}} >
                <View style={{ flex: 0.5, flexDirection: 'row', alignItems: 'center' }}>
                  <Icon size={24} style={{paddingHorizontal: 5}} name={'chart-donut'} color={colors.silver} />
                  <Text style={{ fontSize: 18, color: colors.silver, fontWeight: 'bold'}}>Circulating Supply</Text>
                </View>
                <Text style={{ fontSize: 18, color: colors.silver, fontWeight: 'bold', textAlign: 'right', right: 0, flex: 0.5 }}>{_.ceil(data.circulatingSupply, 2)}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: 10, backgroundColor: colors.transparent}} >
                <View style={{ flex: 0.5, flexDirection: 'row', alignItems: 'center' }}>
                  <Icon size={24} style={{paddingHorizontal: 5}} name={'chart-pie'} color={colors.silver} />
                  <Text style={{ fontSize: 18, color: colors.silver, fontWeight: 'bold'}}>Total Supply</Text>
                </View>
                <Text style={{ fontSize: 18, color: colors.silver, fontWeight: 'bold', textAlign: 'right', right: 0, flex: 0.5 }}>{_.ceil(data.totalSupply, 2)}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: 10, backgroundColor: colors.transparent}} >
                <View style={{ flex: 0.5, flexDirection: 'row', alignItems: 'center' }}>
                  <Icon size={24} style={{paddingHorizontal: 5}} name={'chart-bubble'} color={colors.silver} />
                  <Text style={{ fontSize: 18, color: colors.silver, fontWeight: 'bold'}}>Number Of Markets</Text>
                </View>
                <Text style={{ fontSize: 18, color: colors.silver, fontWeight: 'bold', textAlign: 'right', right: 0, flex: 0.5 }}>{_.ceil(data.numberOfMarkets, 2)}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: 10, backgroundColor: colors.transparent}} >
                <View style={{ flex: 0.5, flexDirection: 'row', alignItems: 'center' }}>
                  <Icon size={24} style={{paddingHorizontal: 5}} name={'chart-scatterplot-hexbin'} color={colors.silver} />
                  <Text style={{ fontSize: 18, color: colors.silver, fontWeight: 'bold'}}>Number Of Exchanges</Text>
                </View>
                <Text style={{ fontSize: 18, color: colors.silver, fontWeight: 'bold', textAlign: 'right', right: 0, flex: 0.5 }}>{_.ceil(data.numberOfExchanges, 2)}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: 10, backgroundColor: colors.transparent}} >
                <View style={{ flex: 0.5, flexDirection: 'row', alignItems: 'center' }}>
                  <Icon size={24} style={{paddingHorizontal: 5}} name={'gesture-swipe-up'} color={colors.silver} />
                  <Text style={{ fontSize: 18, color: colors.silver, fontWeight: 'bold'}}>Popularity</Text>
                </View>
                <Text style={{ fontSize: 18, color: colors.silver, fontWeight: 'bold', textAlign: 'right', right: 0, flex: 0.5 }}>{data.rank}</Text>
              </View>
          <Divider style={{ backgroundColor: colors.silver }} />
          <Text h4 h4Style={{color: colors.silver, fontWeight: 'bold', padding: 10}} >Links</Text>
              <FlatList data={data.links} style={{paddingBottom: 15}} horizontal renderItem={(item) => <Button
                key={item.item.id}
                onPress={() => Linking.openURL(item.item.url)}
                buttonStyle={{backgroundColor: colors.silver, marginHorizontal: 10, borderRadius: 20, paddingHorizontal: 15, alignSelf: 'center'}}
                title={'#' + item.item.name}
                titleStyle={{color: color}}/>
              }/>
              <Divider style={{ backgroundColor: colors.silver }} />
              <Text h4 h4Style={{color: colors.silver, fontWeight: 'bold', padding: 10}} >Socials</Text>
              <FlatList data={data.socials} style={{paddingBottom: 15}} horizontal renderItem={(item) => <Button
                key={item.item.id}
                onPress={() => Linking.openURL(item.item.url)}
                buttonStyle={{backgroundColor: colors.silver, marginHorizontal: 10, borderRadius: 20, paddingHorizontal: 15, alignSelf: 'center'}}
                title={'#' + item.item.name}
                titleStyle={{color: color}}/>
              }/>
              <Divider style={{ backgroundColor: colors.silver }} />

            </ScrollView>
        </View>
      )
    } else {
      let data = coin.payload && coin.payload.data && coin.payload.data.coin
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: color ? color : colors.bloodOrange}}>
          <ActivityIndicator color={colors.silver}/>
        </View>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    coin: state.coin
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    coinRequest: (coin_id, base, timePeriod) => dispatch(CoinActions.coinRequest(coin_id, base, timePeriod))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailScreen)
