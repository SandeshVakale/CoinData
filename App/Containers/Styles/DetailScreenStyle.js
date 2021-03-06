import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes/'
import colors from '../../Themes/Colors'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  active: {
    height: 50,
    borderRadius: 0,
    backgroundColor: colors.transparent,
    borderBottomWidth: 3,
    borderBottomColor: colors.silver,
    width: 70,
    padding: 0
  },
  deactive: {
    height: 50,
    borderRadius: 0,
    backgroundColor: colors.transparent,
    width: 70,
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.silver
  }
})
