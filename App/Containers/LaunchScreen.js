import React, { Component } from 'react'
import { FlatList, View, Dimensions, ActivityIndicator } from 'react-native'
import { Colors } from '../Themes'
import { Button, Avatar } from 'react-native-elements'
import { connect } from 'react-redux'
import CoinsActions from '../Redux/CoinsRedux'

import { SvgCssUri } from 'react-native-svg';
import _ from 'lodash'
import {
  LineChart
} from "react-native-chart-kit";

// Styles
import styles from './Styles/LaunchScreenStyles'
import colors from '../Themes/Colors'

const timePeriods = [
  '24h','7d','30d'
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
    coinsRequest(base, timePeriod, null, null, 7, null)
  }


  reload = (item) => {
    const {base, refresh} = this.state
    const {coinsRequest} = this.props
    this.setState({ timePeriod: item.item, refresh: !refresh })
    console.log('item', item)
    coinsRequest(base, item.item, null, null, 7, null)
  }

  hotReload = (item) => {
    const {timePeriod, refresh} = this.state
    const {coinsRequest} = this.props
    this.setState({ base: item.item, refresh: !refresh })
    //console.log('item', item)
    coinsRequest(item.item, timePeriod, null, null, 7, null)
  }

  componentDidUpdate(prevProps) {
    const {coins} = this.props
    const {active} = this.state
    if(!_.isEqual(coins, prevProps.coins) && coins.fetching === false) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
    {
      this.setState({ graphData: coins.payload.data.coins[active] })
    }
  }

  render () {
    const {coins} = this.props
    const {graphData, timePeriod, refresh, base} = this.state
    console.log(coins)
    if (graphData === null && coins.fetching === false)
    {
     this.setState({graphData: coins.payload.data.coins[0]})
    }

    if (coins.fetching === false) {
      return (
        <View style={{ backgroundColor: this.state.graphData ? this.state.graphData.color : colors.ember, flex: 1 }}>
          <View style={{height: 120}}>
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
            width={Dimensions.get("window").width} // from react-native
            height={300}
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
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ height: 50, borderColor: Colors.coal, marginTop: 50 }}
                      renderItem={(item) => <Button
                        key={item.item.id}
                        titleStyle={{ color: colors.silver }}
                        onPress={() => this.reload(item)}
                        buttonStyle={timePeriod === item.item ? styles.active : styles.deactive}
                        title={item.item}/>
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
        </View>
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
  try {
    return (
      <View style={{padding: 10}}>
      <SvgCssUri
        width={100}
        height={100}
        uri={data.iconUrl}
      />
      </View>
    )
  }
  catch(error) {
    return (
      <View style={{padding: 10}}>
      <Avatar
        rounded
        containerStyle={{height: 100, width: 100}}
        title="NI"
      />
      </View>
    )
    // expected output: ReferenceError: nonExistentFunction is not defined
    // Note - error messages will vary depending on browser
  }
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

