import React, { Component } from 'react'
import { View, Text, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/ExchangesScreenStyle'
import { Header, Overlay } from 'react-native-elements'
import colors from '../Themes/Colors'
import { DateAndTime } from '../Components/DateAndTime'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import _ from 'lodash'

class ExchangesScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isVisible: false,
    }
  }
  render () {

    const { stats } = this.props
    return (
      <View style={{ flex: 1 }}>
        <Header containerStyle={{ backgroundColor: colors.bloodOrange }}
                rightComponent={<DateAndTime/>} centerComponent={{
          text: 'Exchanges',
          style: { color: colors.silver, fontWeight: '900', fontSize: 28 },
        }} leftComponent={<Icon
          // raised
          name='earth'
          size={34}
          color={colors.silver}
          onPress={() => this.setState({ isVisible: true })}/>}/>
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
              }}>{_.ceil(stats.payload.data.totalMarketCap, 2)}</Text>
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
              }}>{_.ceil(stats.payload.data.total24hVolume, 2)}</Text>
            </View>
          </View>
        </Overlay>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    stats: state.stats
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExchangesScreen)
