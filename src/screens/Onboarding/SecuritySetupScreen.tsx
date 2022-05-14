import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppTheme } from 'src/app/hooks'
import { OnboardingStackParamList } from 'src/app/navigation/types'
import FaceIcon from 'src/assets/icons/faceid.svg'
import { PrimaryButton } from 'src/components/buttons/PrimaryButton'
import { TextButton } from 'src/components/buttons/TextButton'
import { Box, Flex } from 'src/components/layout'
import { tryLocalAuthenticate } from 'src/features/biometrics'
import { biometricAuthenticationSuccessful } from 'src/features/biometrics/hooks'
import { OnboardingScreen } from 'src/features/onboarding/OnboardingScreen'
import { ElementName } from 'src/features/telemetry/constants'
import { OnboardingScreens } from 'src/screens/Screens'

type Props = NativeStackScreenProps<OnboardingStackParamList, OnboardingScreens.Security>

export function SecuritySetupScreen({ navigation: { navigate } }: Props) {
  const { t } = useTranslation()
  const theme = useAppTheme()

  const onPressNext = () => {
    navigate(OnboardingScreens.Outro)
  }

  const onPressEnableSecurity = async () => {
    const authStatus = await tryLocalAuthenticate()
    if (biometricAuthenticationSuccessful(authStatus)) {
      onPressNext()
    }
  }

  return (
    <OnboardingScreen
      stepCount={4}
      stepNumber={3}
      subtitle={t(
        'Add an extra layer of security by ensuring that you, and only you, can access your wallet.'
      )}
      title={t('Turn on FaceID')}>
      <Flex grow alignItems="center" justifyContent="space-between">
        <Box bg="deprecated_gray50" borderRadius="lg" p="lg">
          <FaceIcon color={theme.colors.deprecated_gray600} height={100} width={100} />
        </Box>

        <Flex alignItems="center" justifyContent="flex-end" width={'100%'}>
          <PrimaryButton
            alignSelf="stretch"
            label={t('Turn on FaceID')}
            name={ElementName.Enable}
            testID={ElementName.Enable}
            onPress={onPressEnableSecurity}
          />
          <TextButton
            name={ElementName.Skip}
            textColor="deprecated_textColor"
            textVariant="buttonLabel"
            onPress={onPressNext}>
            {t('Skip for now')}
          </TextButton>
        </Flex>
      </Flex>
    </OnboardingScreen>
  )
}
