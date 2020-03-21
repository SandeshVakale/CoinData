import React, { Component } from 'react'
import { View, ActivityIndicator, Dimensions, FlatList, ScrollView } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import CoinActions from '../Redux/CoinRedux'
import { Button, Text, Header, Overlay } from 'react-native-elements'
import {DateAndTime} from '../Components/DateAndTime'
import _ from 'lodash'

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
            <Text style={{ fontSize: 18, backgroundColor: color, fontWeight: 'bold', color: colors.silver, paddingLeft: 10 }}>Price</Text>
          <View style={{ backgroundColor: color, flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }} >
            <Text h4 h4Style={{ backgroundColor: color, color: colors.silver, fontWeight: 'bold' }} >{coin.payload.data.base.sign} {_.ceil(data.price, 2)}</Text>
            <Text style={{fontSize: 18, fontWeight: 'bold', color: Math.sign(data.change) === -1 ? colors.error: colors.lightgreen, paddingLeft: 15}} >{data.change}%</Text>
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
