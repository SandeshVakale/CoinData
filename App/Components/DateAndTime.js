import { Text } from 'react-native-elements'
import colors from '../Themes/Colors'
import moment from 'moment'
import React from 'react'

export const DateAndTime = () => {
  return (
    <Text style={{ color: colors.silver, fontSize: 14, fontWeight: 'bold' }}>{moment().format('MMMM Do')}</Text>
  )
  // expected output: ReferenceError: nonExistentFunction is not defined
  // Note - error messages will vary depending on browser
}
