import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppTheme } from 'src/app/hooks'
import ArrowUpDown from 'src/assets/icons/arrow-up-down.svg'
import { TextButton } from 'src/components/buttons/TextButton'
import { Flex } from 'src/components/layout'
import { Text } from 'src/components/Text'
import { ClientSideOrderBy, CoingeckoOrderBy } from 'src/features/dataApi/coingecko/types'
import { getOrderByLabel } from 'src/features/explore/utils'

interface FilterGroupProps {
  onPressOrderBy: () => void
  orderBy: CoingeckoOrderBy | ClientSideOrderBy
}

export function SortingGroup({ onPressOrderBy, orderBy }: FilterGroupProps) {
  const theme = useAppTheme()
  const { t } = useTranslation()
  return (
    <TextButton mt="md" onPress={onPressOrderBy}>
      <Flex row alignItems="center" gap="xs">
        <ArrowUpDown color={theme.colors.neutralTextTertiary} height={20} width={20} />
        <Text color="neutralTextSecondary" variant="subHead1">
          {getOrderByLabel(orderBy, t)}
        </Text>
      </Flex>
    </TextButton>
  )
}
