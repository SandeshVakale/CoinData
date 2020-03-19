import React, { Component } from 'react'
import { FlatList, View, Dimensions, ActivityIndicator, ScrollView } from 'react-native'
import { Colors } from '../Themes'
import { Button, Text } from 'react-native-elements'
import { connect } from 'react-redux'
import CoinsActions from '../Redux/CoinsRedux'
import SvgUri from 'react-native-svg-uri';
import _ from 'lodash'
import {
  LineChart
} from "react-native-chart-kit";

// Styles
import styles from './Styles/LaunchScreenStyles'
import colors from '../Themes/Colors'

const timePeriods = [
  '24h','7d','30d', '1y', '5y'
]

// const hours = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24 ]
// const days30 = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30 ]
// const days7 = [ 1, 2, 3, 4, 5, 6, 7 ]

const bases = [
  'USD','EUR', 'JPY', 'INR', 'GBP', 'CAD'
]

class LaunchScreen extends Component {
  constructor (props) {
    super(props);
    this.state = {
      active: 0,
      base: 'USD',
      timePeriod: '24h',
      graphData: null,
      refresh: false
    }
  }

  componentDidMount () {
    const {base, timePeriod} = this.state
    const {coinsRequest} = this.props
    coinsRequest(base, timePeriod, null, null, 10, null)
  }


  reload = (item) => {
    const {base, refresh} = this.state
    const {coinsRequest} = this.props
    this.setState({ timePeriod: item.item, refresh: !refresh })
    console.log('item', item)
    coinsRequest(base, item.item, null, null, 10, null)
  }

  hotReload = (item) => {
    const {timePeriod, refresh} = this.state
    const {coinsRequest} = this.props
    this.setState({ base: item.item, refresh: !refresh })
    //console.log('item', item)
    coinsRequest(item.item, timePeriod, null, null, 10, null)
  }

  componentDidUpdate(prevProps) {
    const {coins} = this.props
    const {active} = this.state
    if(!_.isEqual(coins, prevProps.coins) && coins.fetching === false)
    {
      this.setState({ graphData: coins.payload.data.coins[active] })
    }
  }

  render () {
    const {coins} = this.props
    const {graphData, timePeriod, refresh, base} = this.state
    console.log(coins)
    if (graphData === null && coins.fetching === false && coins.payload !== null)
    {
     this.setState({graphData: coins.payload.data.coins[0]})
    }
    if (coins.fetching === false) {
      return (
        <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: this.state.graphData && this.state.graphData.color !== null ? this.state.graphData.color : colors.ember, flex: 1 }}>
          {/*<SafeAreaView />*/}
          <View >
          <FlatList data={coins.payload.data.coins} horizontal extraData={refresh}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ height: 50, borderColor: Colors.coal, marginTop: 50 }}
                    renderItem={(item) => <Button
                      key={item.item.id}
                      titleStyle={{ color: colors.silver }}
                      onPress={() => this.setState({ active: item.index, graphData: item.item, refresh: !refresh })}
                      buttonStyle={this.state.active === item.index ? styles.active : styles.deactive}
                      title={item.item.symbol}/>
                    }/>
          </View>
          <View style={{ alignItems: 'center' }}>
          {graphData && <LineChart
            data={{
              // labels: timePeriod === '24h' ? hours : timePeriod === '7d' ? days7 : days30,
              datasets: [
                {
                  data: graphData.history
                }
              ]
            }}
            withDots={false}
            width={Dimensions.get("window").width} // from react-native
            height={280}
            yAxisLabel={coins.payload.data.base.sign}
            yAxisSuffix={"k"}
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: this.state.graphData.color,
              backgroundGradientFrom: this.state.graphData.color,
              backgroundGradientTo: this.state.graphData.color,
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: this.state.graphData.color
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
                        titleStyle={{ color: colors.silver }}
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
                        titleStyle={{ color: colors.silver }}
                        onPress={() => this.hotReload(item)}
                        buttonStyle={base === item.item ? styles.active : styles.deactive}
                        title={item.item}/>
                      }/>
          </View>

          {graphData && svgBloack(graphData)}
            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <Text style={{color: colors.silver, textAlign: 'center', fontSize: 14}} >Price</Text>
              <Text style={{color: colors.silver, textAlign: 'center', fontSize: 14}} >Change</Text>
            </View>
          {graphData && <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',  marginTop: -15}}>
            <Text h3 h3Style={{color: colors.silver, width: '49%', textAlign: 'center', fontSize: 20}} >{coins.payload.data.base.sign + _.ceil(graphData.price, 2)}</Text>
            <View style={{height: 70, width: 1, marginTop: -10, backgroundColor: colors.silver}}/>
            <Text h3 h3Style={{color: colors.silver, width: '49%', textAlign: 'center', fontSize: 20}}>{_.ceil(graphData.change, 2) + '%'}</Text>
          </View>}

          {graphData && Dimensions.get("window").height > 700 && <Text style={{color: colors.silver, fontSize: 18, padding: 15}}>{graphData.description}</Text>}
          {graphData && <Button buttonStyle={{backgroundColor: colors.silver, marginVertical: 10, paddingHorizontal: 30, width: '80%', alignSelf: 'center'}} title={'Get Coins Data ->'} titleStyle={{color: graphData.color}}/>}
        </ScrollView>
      )
    } else {
       return (
         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: this.state.graphData ? this.state.graphData.color : colors.ember}}>
           <ActivityIndicator color={Colors.silver}/>
         </View>
       )
    }
  }
}


const svgBloack = (data) => {
    return (
      <View style={{paddingTop: 10, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
        <SvgUri
          style={{flex: 0.5, alignItems: 'center'}}
          width={60}
          height={60}
          source={{ uri: data.iconUrl}}
        />
        <Text h4 h4Style={{ fontWeight: 'bold', color: colors.silver, flex: 0.5, textAlign: 'center' }} >{data.name}</Text>
      </View>
    )
    // expected output: ReferenceError: nonExistentFunction is not defined
    // Note - error messages will vary depending on browser
}

const mapStateToProps = (state) => {
  return {
    coins: state.coins
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    coinsRequest: (base, timePeriod, ids, sort, limit, order) => dispatch(CoinsActions.coinsRequest(base, timePeriod, ids, sort, limit, order))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LaunchScreen)

