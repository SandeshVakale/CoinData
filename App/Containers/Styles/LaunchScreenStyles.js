import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles } from '../../Themes/'
import colors from '../../Themes/Colors'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    paddingBottom: Metrics.baseMargin
  },
  logo: {
    marginTop: Metrics.doubleSection,
    height: Metrics.images.logo,
    width: Metrics.images.logo,
    resizeMode: 'contain'
  },
  centered: {
    alignItems: 'center'
  },
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
