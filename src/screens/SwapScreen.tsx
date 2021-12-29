import { useHeaderHeight } from '@react-navigation/elements'
import React, { useReducer } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'
import { AppStackScreenProp } from 'src/app/navigation/types'
import { SheetScreen } from 'src/components/layout/SheetScreen'
import { Header } from 'src/features/swap/Header'
import { SwapForm } from 'src/features/swap/SwapForm'
import { initialSwapFormState, swapFormReducer } from 'src/features/swap/swapFormSlice'
import { Screens } from 'src/screens/Screens'

export function SwapScreen({ route, navigation }: AppStackScreenProp<Screens.Swap>) {
  const [state, dispatch] = useReducer(
    swapFormReducer,
    route.params?.swapFormState || initialSwapFormState
  )

  const chainId = state[state.exactCurrencyField]?.chainId
  const headerHeight = useHeaderHeight()

  return (
    <SheetScreen>
      <KeyboardAvoidingView
        keyboardVerticalOffset={headerHeight + 70}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <Header chainId={chainId} onPressBack={() => navigation.goBack()} />
        <SwapForm state={state} dispatch={dispatch} />
      </KeyboardAvoidingView>
    </SheetScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
